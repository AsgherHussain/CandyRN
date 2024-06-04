from rest_framework import serializers
from .models import Broadcast, Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    A custom serializer for handling notifications
    """
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault(),
    )

    class Meta:
        model = Notification
        fields = '__all__'


class BroadcastSerializer(serializers.ModelSerializer):
    """
    A custom serializer for handling broadcasts by the admin
    """
    class Meta:
        model = Broadcast
        fields = '__all__'
