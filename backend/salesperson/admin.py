from django.contrib import admin
from salesperson.forms import SalesPersonForm
from salesperson.models import AssignedUser, SalesPerson
from django.contrib.auth import get_user_model

User = get_user_model()


class AssignedUserInline(admin.StackedInline):
    model = AssignedUser
    extra = 0
    autocomplete_fields = ['user']


class SalesPersonAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'note', 'phone')
    list_display_links = ('first_name', 'last_name', 'note', 'phone')
    inlines = [AssignedUserInline]
    ordering = ['first_name', 'last_name', 'email', 'phone']
    form = SalesPersonForm

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "user":
            kwargs["queryset"] = User.objects.filter(user_type='SALES_PERSON')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    class Media:
        js = ('https://code.jquery.com/jquery-3.6.0.min.js',
            'javascript/salesperson/salesperson.js',)


class AssignedUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'salesperson')
    list_display_links = ('user', 'salesperson')


admin.site.register(SalesPerson, SalesPersonAdmin)
admin.site.register(AssignedUser, AssignedUserAdmin)
