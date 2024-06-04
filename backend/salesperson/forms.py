from django import forms
from salesperson.models import SalesPerson


class SalesPersonForm(forms.ModelForm):
    class Meta:
        model = SalesPerson
        fields = '__all__'

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        user = self.cleaned_data.get('user')
        if user and user.phone:
            if user.phone != phone:
                raise forms.ValidationError(f"Phone number should be same")

        return phone

    def clean_first_name(self):
        first_name = self.cleaned_data.get('first_name')
        user = self.cleaned_data.get('user')
        if user and user.first_name:
            if user.first_name != first_name:
                raise forms.ValidationError("First name should be same")

        return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data.get('last_name')
        user = self.cleaned_data.get('user')

        if user and user.last_name:
            if user.last_name != last_name:
                raise forms.ValidationError("Last name should be same")

        return last_name

    def clean_email(self):
        email = self.cleaned_data.get('email')
        user = self.cleaned_data.get('user')

        if user and user.email:
            if user.email != email:
                raise forms.ValidationError("Email should be same")

        return email
