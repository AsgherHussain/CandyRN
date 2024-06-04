from django.contrib import admin

from orders.models import Invoice, Order


# Register your models here.

class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "user",
        "status",
        "style",
        "quantity",
        "num_packs",
        "half_pack",
        "date_time",
        "salesperson"

    ]
    search_fields = ["id", "status", "style", "quantity", "salesperson"]


class InvoiceAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "sid",
        "tracking_number_id",
        "sub_total",
        "shipping_cost",
        "discount",
        "total",

    ]
    search_fields = ["id", "sid", "tracking_number_id", "status", "half_pack", "description"]


admin.site.register(Order, OrderAdmin)
admin.site.register(Invoice, InvoiceAdmin)
