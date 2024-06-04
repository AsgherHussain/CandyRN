from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from splashscreen.api.v1.serializers import SplashScreenSerializer
from splashscreen.models import SplashScreen


class SplashScreenViewSet(ModelViewSet):
    serializer_class = SplashScreenSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post']

    def get_queryset(self):
        queryset = SplashScreen.objects.all()
        if queryset:
            queryset = queryset.last()
            return [queryset]
        return []
