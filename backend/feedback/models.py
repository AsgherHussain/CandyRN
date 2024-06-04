from django.db import models
from home.models import UUIDModel


class Feedback(UUIDModel):
    """
    A adata representation of a Users Feedback to the Admin
    """
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name="feedback")
    content = models.TextField()

    class Meta:
        verbose_name_plural = "Feedback"
