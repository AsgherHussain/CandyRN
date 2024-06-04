from users.models import User


class PhoneAuthenticationBackend(object):
    def authenticate(self, request, phone=None, password=None):
        try:
            user = User.objects.get(phone=phone)
            pwd_valid = user.check_password(password)
            if pwd_valid:
                return user
            return None
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
