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


@strawberry.type
class Query:
    @strawberry.field
    def posts(self) -> typing.List[PostGQL]:
        posts = models.Post.objects.all().order_by("-created_at")
        return [PostGQL(
            id=post.id,
            creator_id=post.creator_id,
            content=post.content,
            created_at=post.created_at,
            edited_at=post.edited_at if post.edited_at else None,
            like_count=post.likes.count()
        ) for post in posts]
    
schema = strawberry.Schema(query=Query)