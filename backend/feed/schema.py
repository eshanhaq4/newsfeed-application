import typing
import strawberry
import feed.models as models
from django.db.models import Q
from django.db import transaction
from datetime import datetime

@strawberry.type
class PostGQL:
    id: int
    creator_id: int
    content: str
    created_at: datetime
    edited_at: typing.Optional[datetime]
    like_count: int

def post_gql(post: models.Post) -> PostGQL:
    return PostGQL(
        id=post.id,
        creator_id=post.creator_id,
        content=post.content,
        created_at=post.created_at,
        edited_at=post.edited_at,
        like_count=post.like_count,
    )

@strawberry.type
class FeedPage:
    posts: typing.List[PostGQL]
    next_cursor: typing.Optional[str]

@strawberry.type
class Query:
    
    @strawberry.field
    def feed(self, cursor: typing.Optional[str] = None, limit: int = 20) -> FeedPage:
        posts = models.Post.objects.all().order_by("-created_at", "-id")
        if cursor:
            try:
                created_at_str, id_str = cursor.split("_")
                created_at = datetime.fromisoformat(created_at_str)
                post_id = int(id_str)
                posts = posts.filter(Q(created_at__lt=created_at) | (Q(created_at=created_at, id__lt=post_id)))
            except ValueError:
                pass

        posts = list(posts[:limit])
        next_cursor = None
        if len(posts) == limit:
            last_post = posts[-1]
            next_cursor = f"{last_post.created_at.isoformat()}_{last_post.id}"
        
        return FeedPage(posts=[post_gql(post) for post in posts], next_cursor=next_cursor)

    
@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_post(self, creator_id: int, content: str) -> PostGQL:
        post = models.Post.objects.create(creator_id=creator_id, content=content)
        return post_gql(post)

    @strawberry.mutation
    def toggle_like(self, user_id: int, post_id: int) -> PostGQL:
        with transaction.atomic():
            post = models.Post.objects.select_for_update().get(id=post_id)
            created = models.Like.objects.filter(user_id=user_id, post=post)

            if created.exists():
                created.delete()
                post.like_count -= 1
            else:
                models.Like.objects.create(user_id=user_id, post=post)
                post.like_count += 1

        post.save()
        post.refresh_from_db()

        return post_gql(post)
    
    @strawberry.mutation
    def edit_post(self, post_id: int, new_content: str) -> PostGQL:
        post = models.Post.objects.get(id=post_id)
        post.content = new_content
        post.edited_at = datetime.now()
        post.save()
        post.refresh_from_db()

        return post_gql(post)
    
    @strawberry.mutation
    def delete_post(self, post_id: int) -> int:
        post = models.Post.objects.get(id=post_id)
        post.delete()
        return post_id

schema = strawberry.Schema(query=Query, mutation=Mutation)