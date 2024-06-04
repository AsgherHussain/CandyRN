from rest_framework import serializers

from home.api.v1.serializers import UserField
from .models import Feedback
from users.models import User


class FeedbackSerializer(serializers.ModelSerializer):
    """
    A data representation of a User's Feedback to the Admin
    """
    user = UserField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Feedback
        fields = '__all__'
