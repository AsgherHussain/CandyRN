from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from feedback.models import Feedback
from feedback.serializers import FeedbackSerializer
from home.utility import send_feedback
from users.authentication import ExpiringTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class FeedbackViewSet(ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Feedback.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"])
    def respond(self, request):
        feedback = Feedback.objects.get(id=request.data.get('feedback'))
        title = request.data.get('title')
        body = request.data.get('body')
        recipient = feedback.user
        if recipient.email:
            send_feedback(title, body, recipient.email)
            return Response(status=status.HTTP_200_OK)
        return Response({'detail': 'User does not have an Email Address'}, status=status.HTTP_400_BAD_REQUEST)
