import re

from django.http import JsonResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from home.api.v1.serializers import UserSerializer
from salesperson.models import SalesPerson, AssignedUser
from salesperson.serializers import SalesPersonSerializer, SalesPersonListSerializer, AssignedUserSerializer
from users.models import User


# Create your views here.


class SalesPersonView(ModelViewSet):
    queryset = SalesPerson.objects.all()
    serializer_class = SalesPersonSerializer

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return SalesPersonListSerializer
        return super().get_serializer_class()


class AssignedUserView(ModelViewSet):
    queryset = AssignedUser.objects.all()
    serializer_class = AssignedUserSerializer

    @action(detail=False, methods=['get'])
    def get_unassigned_user(self, request):
        all_users = User.objects.all()
        assigned_users = AssignedUser.objects.values_list('user_id', flat=True)
        unassigned_users = all_users.exclude(pk__in=assigned_users)
        serializer = UserSerializer(unassigned_users, many=True)
        return Response(serializer.data)


def get_salespersons(request):
    salespersons = SalesPerson.objects.all()
    salespersons_json = [
        {'id': salesperson.id, 'first_name': salesperson.first_name, 'last_name': salesperson.last_name,
         'user_name': salesperson.user.name} for salesperson
        in salespersons]
    return JsonResponse({'salespersons': salespersons_json})


def assign_salesperson(request):
    if request.method == 'POST' and request.is_ajax():
        salesperson_id = request.POST.get('salesperson_id')

        try:
            uuid = request.headers.get("Referer")
            uuid_pattern = r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})'

            uuid_match = re.search(uuid_pattern, uuid)

            if uuid_match:
                uuid = uuid_match.group(0)
            salesperson = SalesPerson.objects.get(pk=salesperson_id)
            assigned_user, created = AssignedUser.objects.get_or_create(user_id=uuid, salesperson=salesperson)

            return JsonResponse({'success': True})
        except SalesPerson.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Salesperson does not exist'})

    return JsonResponse({'success': False, 'error': 'Invalid request'})


def get_assigned_salesperson(request):
    if request.is_ajax():
        try:
            uuid = request.headers.get("Referer")
            uuid_pattern = r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})'

            uuid_match = re.search(uuid_pattern, uuid)

            if uuid_match:
                uuid = uuid_match.group(0)
                print("Extracted UUID:", uuid)
            else:
                print("No UUID found in the URL.")

            assigned_user = AssignedUser.objects.get(user_id=uuid)
            assigned_salesperson_id = assigned_user.salesperson.id
            return JsonResponse({'assigned_salesperson_id': assigned_salesperson_id})
        except AssignedUser.DoesNotExist:
            return JsonResponse({'assigned_salesperson_id': None})

    return JsonResponse({'error': 'Invalid request'})


def delete_assigned_user(request):
    try:
        uuid = request.headers.get("Referer")
        uuid_pattern = r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})'

        uuid_match = re.search(uuid_pattern, uuid)

        if uuid_match:
            uuid = uuid_match.group(0)
        assigned_user = AssignedUser.objects.get(user_id=uuid)
        assigned_user.delete()

        return JsonResponse({'success': True})
    except AssignedUser.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Assigned user does not exist'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})
