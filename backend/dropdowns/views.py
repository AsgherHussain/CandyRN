from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from dropdowns.models import Color, Size
from dropdowns.serializers import ColorSerializer, SizeSerializer
from users.authentication import ExpiringTokenAuthentication
from rest_framework.permissions import AllowAny


class ColorsViewSet(ModelViewSet):
    serializer_class = ColorSerializer
    permission_classes = (AllowAny,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Color.objects.all()


class SizeViewSet(ModelViewSet):
    serializer_class = SizeSerializer
    permission_classes = (AllowAny,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Size.objects.all()
