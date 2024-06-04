from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.db.models import Q

from users.forms import UserChangeForm, UserCreationForm
from users.models import Profile

User = get_user_model()

auth_admin.UserAdmin.fieldsets = (
    (None, {'fields': ('username', 'password')}),
    ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'country', 'city')}),
    ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    ('Important dates', {'fields': ('last_login', 'date_joined')}),
)


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": (
        "name", "flagged", "registration_id", "phone", "user_type")}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["email", "name", "phone", "is_superuser", "flagged", "registration_id", "salesperson_user"]
    list_display_links = ["email", "name", "phone", "is_superuser", "registration_id"]
    search_fields = ["name", "first_name", "last_name", "email", "phone"]
    change_form_template = 'admin/salesperson.html'

    def get_search_results(self, request, qs, term):
        if 'autocomplete' in request.path:
            from salesperson.models import AssignedUser
            salespersons = list(AssignedUser.objects.values_list("user_id", flat=True))
            exclude_condition = Q(user_type='SALES_PERSON') | Q(is_superuser=True) | Q(id__in=salespersons)
            qs = qs.exclude(exclude_condition)
        return super().get_search_results(request, qs, term)

    def get_search_fields(self, request):
        if 'autocomplete' in request.path:
            search_fields = ['first_name', 'last_name', 'email', 'phone']
            return search_fields
        return self.search_fields

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(user_type='SALES_PERSON')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


admin.site.register(Profile)
