from django.contrib.auth import get_user_model, forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from salesperson.models import AssignedUser

User = get_user_model()


class UserChangeForm(forms.UserChangeForm):
    class Meta(forms.UserChangeForm.Meta):
        model = User

    def clean_user_type(self):
        from django import forms
        user_type = self.cleaned_data.get('user_type')
        if user_type == 'SALES_PERSON':
            if AssignedUser.objects.filter(user=self.instance).exists():
                raise forms.ValidationError("This user is already assigned to a salesperson, "
                                            "so it cannot be a salesperson.")

        return user_type


class UserCreationForm(forms.UserCreationForm):

    error_message = forms.UserCreationForm.error_messages.update(
        {"duplicate_username": _("This username has already been taken.")}
    )

    class Meta(forms.UserCreationForm.Meta):
        model = User

    def clean_username(self):
        username = self.cleaned_data["username"]

        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username

        raise ValidationError(self.error_messages["duplicate_username"])
