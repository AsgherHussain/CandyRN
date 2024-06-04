from rest_framework import serializers
from splashscreen.models import SplashScreen


class SplashScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = SplashScreen
        fields = '__all__'

