from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from royal_cloud_33498.settings import SECRET_KEY
from users.models import User
from users.authentication import ExpiringTokenAuthentication
from home.permissions import IsPostOrIsAuthenticated

from home.utility import auth_token, generateOTP, send_otp_sms
from users.serializers import ChangePasswordSerializer, CustomAuthTokenSerializer, OTPSerializer, UserProfileSerializer


class UserViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = (IsPostOrIsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'last_name', 'phone', "email", "flagged"]

    def get_queryset(self):
        if self.request.user.user_type == 'SALES_PERSON':
            return User.objects.filter(Q(sales_assigned_user__salesperson__user=self.request.user))
        return super().get_queryset().filter(is_superuser=False)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Create User and return Token + Profile
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token, created = Token.objects.get_or_create(user=serializer.instance)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

        # Update Profile

    def partial_update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Send a OTP
    @action(detail=False, methods=['post'])
    def otp(self, request):
        try:
            phone = request.data.get('phone')
            user = User.objects.get(phone=phone)
        except ObjectDoesNotExist:
            return Response({"detail": "Invalid Phone Number - Does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        generateOTP(phone=phone, user=user)
        return Response(status=status.HTTP_200_OK)

    # Verify OTP
    @action(detail=False, methods=['post'])
    def verify(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = auth_token(user)
            serializer = UserProfileSerializer(user)
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Set password
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['password_1'])
            user.save()
            return Response({'detail': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Login a User
    @action(detail=False, methods=['post'])
    def login(self, request, **kwargs):
        serializer = CustomAuthTokenSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if user.user_type == 'SALES_PERSON':
                user.is_superuser = True
                user.save()
            token = auth_token(user)
            serializer = UserProfileSerializer(user, context={'request': request})
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Logout a User
    @action(detail=False, methods=['post'])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            return Response({'detail': 'Authentication Token Missing or Invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_200_OK)

    # Admin a User
    @action(detail=False, methods=['post'])
    def admin(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        phone = request.data.get('phone')
        key = request.data.get('key')
        if key != SECRET_KEY:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create(
            username=username,
            email=email,
            phone=phone
        )
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return Response(status=status.HTTP_200_OK)
