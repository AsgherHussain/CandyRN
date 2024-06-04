from django.db import models

# Create your models here.


class SplashScreen(models.Model):
    image = models.ImageField(upload_to='splashscreen/images')
