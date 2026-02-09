from django.db import models

# Create your models here.

# posts
class Post(models.Model):
    creator_id = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(null=True, blank=True)
    like_count = models.IntegerField(default=0)

    def __str__(self):\
        return f"Post {self.id} by User {self.creator_id}"
    
class Like(models.Model):
    user_id = models.IntegerField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')

    def __str__(self):
        return f"Like by User {self.user_id} on Post {self.post.id}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user_id', 'post'], name='unique_like')
        ]