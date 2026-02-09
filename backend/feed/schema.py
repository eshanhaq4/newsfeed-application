import typing
import strawberry
import feed.models as models
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
class Query:
    @strawberry.field
    def posts(self) -> typing.List[PostGQL]:
        posts = models.Post.objects.all().order_by("-created_at")
        return [post_gql(post) for post in posts]
    
@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_post(self, creator_id: int, content: str) -> PostGQL:
        post = models.Post.objects.create(creator_id=creator_id, content=content)
        return post_gql(post)

    @strawberry.mutation
    def toggle_like(self, user_id: int, post_id: int) -> PostGQL:
        post = models.Post.objects.get(id=post_id)
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