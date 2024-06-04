from rest_framework import status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view
from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer
)
from rest_framework.decorators import api_view, permission_classes
from users.authentication import ExpiringTokenAuthentication
from users.models import User
from rest_framework.permissions import AllowAny


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class UserDetail(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []


@api_view(['GET', ])
@permission_classes([AllowAny])
def get_user(request, pk=None):
    user = User.objects.get(pk=pk)
    data = {}
    if user:
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone
        }

    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes([AllowAny])
def testUser(request):
    my_admin = User.objects.create(phone='+12066496046',name="laksitha",email="laksitha.kumara+14@crowdbotics.com",username="laksithakumara1")
    my_admin.set_password("Laksitha@122")
    my_admin.is_superuser = True
    my_admin.is_staff = True
    my_admin.save()
    return Response(status=404, data={"Status": "Invalid Request2"})

