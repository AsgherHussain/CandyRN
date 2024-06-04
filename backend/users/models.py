from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
import uuid
from django.core.validators import RegexValidator
from home.constants import UserTypes
from home.models import UUIDModel
from django_countries.fields import CountryField


class User(AbstractUser):
    # Validators
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_type = models.CharField(max_length=50, choices=UserTypes, null=True, blank=True)
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    phone = models.CharField(validators=[phone_regex], max_length=17, unique=True)
    activation_key = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    country = CountryField(null=True, blank=True)
    registration_id = models.CharField(max_length=255, blank=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    flagged = models.BooleanField(default=True)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def save(self, *args, **kwargs):
        if self.city or self.country:
            try:
                profile = Profile.objects.get(user_id=self.id)
                profile.country = self.country.__dict__.get('code')
                profile.city = self.city
                profile.save()
            except Profile.DoesNotExist:
                Profile.objects.create(user_id=self.id, country=self.country, city=self.city)
        return super(self.__class__, self).save(*args, **kwargs)



class Profile(UUIDModel):
    """
    A data represention of the non-authentication related fields of a User Profile
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='users/photos', blank=True, null=True)
    shipping_address = models.TextField(blank=True)
    city = models.CharField(max_length=150, blank=True)
    zip_code = models.CharField(max_length=7, blank=True)
    state = models.CharField(max_length=150, blank=True)
    country = models.CharField(max_length=150, blank=True)
