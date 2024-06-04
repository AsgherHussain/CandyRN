from rest_framework import serializers

from home.api.v1.serializers import UserSerializer
from salesperson.models import SalesPerson, AssignedUser


class AssignedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedUser
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user_representation = {
            'id': instance.user.id,
            'username': instance.user.username,
            'email': instance.user.email,
            'first_name': instance.user.first_name,
            'last_name': instance.user.last_name,
            'phone': instance.user.phone
        }
        representation['user'] = user_representation
        return representation


class SalesPersonSerializer(serializers.ModelSerializer):
    assigned_users = AssignedUserSerializer(source='assigned_to_salesperson.user', many=True, read_only=True)

    class Meta:
        model = SalesPerson
        fields = ["id", "user", "assigned_users", "first_name", "last_name", "email", "phone", "note"]


class SalesPersonListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    assigned_users = AssignedUserSerializer(source='assigned_to_salesperson', many=True, read_only=True)

    class Meta:
        model = SalesPerson
        fields = ["id", "user", "assigned_users", "first_name", "last_name", "email", "phone", "note"]
