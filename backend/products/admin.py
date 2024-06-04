from django.contrib import admin

from .models import Category, Brand, Product


# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "name"

    ]
    search_fields = ["id", "name"]


class BrandAdmin(admin.ModelAdmin):
    list_display = [
        "name"

    ]
    search_fields = ["id", "name"]


class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "sid",
        "brand",
        "category",
        "half_pack_available",
        "type",
        "upload_date"
    ]
    search_fields = ["id", "sid", "type", "upload_date", "brand", "category"]


admin.site.register(Category, CategoryAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Product, ProductAdmin)
