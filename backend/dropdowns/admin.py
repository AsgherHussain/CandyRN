from django.contrib import admin

from .models import Color, Size


# Register your models here.

class ColorAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "hex_code"
    ]
    search_fields = ["name"]


admin.site.register(Color, ColorAdmin)
admin.site.register(Size)
