from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from home.utility import send_notification_to_all
from notifications.models import Broadcast, Notification
from notifications.serializers import BroadcastSerializer, NotificationSerializer
from users.authentication import ExpiringTokenAuthentication


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Notification.objects.all()

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get', 'post'])
    def read(self, request):
        user = request.user
        if request.method == "GET":
            user.notification_set.all().update(read=True)
        else:
            notif = request.data.get('notification', None)
            if notif:
                try:
                    notif_obj = Notification.objects.get(id=notif)
                    notif_obj.read = True
                    notif_obj.save()
                except Notification.DoesNotExist:
                    return Response({'detail': 'Invalid Notification ID'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = NotificationSerializer(user.notification_set.all(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def broadcast(self, request):
        title = request.data.get('title')
        content = request.data.get('content')
        send_notification_to_all(
            title=title,
            content=content
        )
        Broadcast.objects.create(
            title=title,
            content=content
        )
        return Response({'Notifications broadcasted successfully'}, status=status.HTTP_200_OK)


class BroadcastViewSet(ModelViewSet):
    serializer_class = BroadcastSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Broadcast.objects.all()
