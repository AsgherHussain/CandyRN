from django.contrib.auth import authenticate
from rest_framework import serializers
from home.utility import verifyOTP
from orders.models import Cart, Order
from orders.serializers import OrderSerializer, CartSerializer
from salesperson.models import AssignedUser
from users.models import Profile, User


class ProfileSerializer(serializers.ModelSerializer):
    """
    A data representation of the non-authentication related fields of a User
    """

    class Meta:
        model = Profile
        exclude = ('id', 'user')


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating a User
    """
    profile = ProfileSerializer(required=False)
    is_admin = serializers.SerializerMethodField()
    completed_date = serializers.SerializerMethodField()
    salesperson = serializers.SerializerMethodField()
    total_in_cart = serializers.DecimalField(
        source='cart.total',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = User
        fields = ('id', 'name', 'last_name', 'phone', 'email',
                  'password', 'profile', 'flagged', 'is_admin', 'registration_id', 'salesperson', "total_in_cart", "completed_date", "user_type")
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5},
                        'phone': {'required': True},
                        'name': {'required': True},
                        'last_name': {'required': True},
                        'email': {'required': False}
                        }

    def create(self, validated_data):
        password = validated_data.get('password')
        phone = validated_data.get('phone')
        email = validated_data.get('email', None)
        validated_data['username'] = phone
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        Profile.objects.create(user=user)
        Cart.objects.create(user=user)
        # if email:
        #     set_email(email=email, user=user)
        return user

    def update(self, instance, validated_data):
        phone = validated_data.get('phone', None)
        email = validated_data.get('email', None)
        if phone:
            validated_data['username'] = phone
        if 'profile' in validated_data:
            nested_serializer = self.fields['profile']
            nested_instance = instance.profile
            nested_data = validated_data.pop('profile')
            nested_serializer.update(nested_instance, nested_data)
        user = super().update(instance, validated_data)
        # if email:
        #     set_email(email=email, user=user)
        return user

    def get_salesperson(self, obj):
        try:
            from salesperson.serializers import SalesPersonSerializer
            assigned_user = AssignedUser.objects.get(user=obj)
            salesperson = assigned_user.salesperson
            salesperson_data = SalesPersonSerializer(salesperson).data
            return salesperson_data
        except AssignedUser.DoesNotExist:
            return None

    def get_completed_date(self, obj):
        try:
            order = Order.objects.filter(user=obj, status='Completed').latest('confirmed_date')
            return order.confirmed_date
        except Order.DoesNotExist:
            return None

    def get_is_admin(self, obj):
        return obj.is_superuser


class OTPSerializer(serializers.Serializer):
    """
    Custom serializer to verify an OTP
    """
    otp = serializers.CharField(max_length=4, required=True)
    phone = serializers.CharField(required=True)

    def validate(self, attrs):
        phone = attrs.get('phone')
        otp = attrs.get('otp')
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid Phone Number'})
        else:
            if verifyOTP(otp=otp, activation_key=user.activation_key, user=user):
                user.is_active = True
                user.activation_key = ''
                user.otp = ''
                user.save()
                attrs['user'] = user
                return attrs
            else:
                raise serializers.ValidationError({'detail': 'Invalid or Expired OTP, please try again'})


class ChangePasswordSerializer(serializers.Serializer):
    """
    Custom serializer used to set the password for a User
    """
    password_1 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_2 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        pass1 = attrs.get('password_1')
        pass2 = attrs.get('password_2')
        if pass1 != pass2:
            raise serializers.ValidationError({'detail': 'Passwords do not match'})
        return super().validate(attrs)


class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Serializer for returning an authenticated User and Token
    """
    phone = serializers.CharField(required=False)
    email = serializers.CharField(required=False)
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, required=True)

    def validate(self, attrs):
        phone = attrs.get('phone', None)
        email = attrs.get('email', None)
        password = attrs.get('password')
        user = None
        if email:
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )
        else:
            user = authenticate(
                request=self.context.get('request'),
                phone=phone,
                password=password
            )
        if not user:
            raise serializers.ValidationError({'detail': 'Unable to authenticate with provided credentials'})
        attrs['user'] = user
        return attrs
