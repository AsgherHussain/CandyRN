from django.urls import path, include
from rest_framework.routers import DefaultRouter
from splashscreen.api.v1.viewset import SplashScreenViewSet

router = DefaultRouter()
router.register('splash-screen', SplashScreenViewSet, basename='splash_screen')

urlpatterns = [
    path("", include(router.urls))
]
