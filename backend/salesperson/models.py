from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import RegexValidator

User = get_user_model()


class SalesPerson(models.Model):
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='salesperson_user')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(validators=[phone_regex], max_length=17, unique=True)
    note = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.user.name}"

    def save(self, *args, **kwargs):
        if self.user:
            if not self.user.first_name and self.first_name:
                self.user.first_name = self.first_name
            if not self.user.last_name and self.last_name:
                self.user.last_name = self.last_name
            if not self.user.email and self.email:
                self.user.email = self.email
            if not self.user.phone and self.phone:
                self.user.phone = self.phone

            self.user.save()

        super().save(*args, **kwargs)


class AssignedUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='sales_assigned_user')
    salesperson = models.ForeignKey(SalesPerson, on_delete=models.CASCADE, related_name='assigned_to_salesperson')

    def __str__(self):
        return f"{self.user.name}-{self.salesperson.first_name}"

