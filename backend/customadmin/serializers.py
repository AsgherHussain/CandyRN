from rest_framework import serializers
from django.db.models import Count, Sum

from users.serializers import UserProfileSerializer

from orders.models import Invoice, Order
from orders.serializers import OrderSerializer

from products.models import Brand, Category, Product
from products.serializers import BrandField, CategoryField, PhotoSerializer


class AdminProductSerializer(serializers.ModelSerializer):
    """
    A data representation of the Orders viewed by an Admin
    """
    # totals = serializers.SerializerMethodField()
    brand = BrandField(queryset=Brand.objects.all(), required=False)
    category = CategoryField(queryset=Category.objects.all(), required=False)
    photos = PhotoSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    """
    A data representation of the Invoices that contain multiple orders
    """
    class Meta:
        model = Invoice
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['orders'] = OrderSerializer(
            instance.orders.all(),
            many=True
        ).data
        rep['total_quantity'] = instance.orders.aggregate(
            quantity=Sum('quantity')
        )
        if instance.user:
            rep['user'] = UserProfileSerializer(instance.user).data
        return rep


class AdminOrderSerializer(serializers.ModelSerializer):
    """
    A serializer for the Confirmed tab of the Pending/Completed Orders list
    """
    product = AdminProductSerializer(required=False)
    user = UserProfileSerializer(read_only=True)
    customer_count = serializers.IntegerField(read_only=True)
    quantity_count = serializers.IntegerField(read_only=True)
    amount_count = serializers.DecimalField(max_digits=None, decimal_places=2, read_only=True)
    pack_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_pack_count(self, obj):
        return int(obj.quantity_count / 6) if obj.quantity_count else 0
