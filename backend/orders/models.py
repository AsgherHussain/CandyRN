from datetime import datetime
from django.db import models
from django.db.models import Sum, Value
from django.db.models.functions import Coalesce

from home.constants import STATUS_TYPE
from home.models import UUIDModel
from salesperson.models import AssignedUser, SalesPerson
from users.models import User
from products.models import Product
from shortuuid.django_fields import ShortUUIDField


class Cart(UUIDModel):
    """
    A data representation of the multiple orders in a Cart
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class CartOrder(UUIDModel):
    """
    A data representation of the temporary cart items
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='orders')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='in_cart')
    style = models.CharField(max_length=150, blank=True)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)


class Transaction(UUIDModel):
    """
    A data representation of a customer's entire Cart on submission
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='transactions'
    )
    date = models.DateTimeField(
        auto_now_add=True
    )


class Order(UUIDModel):
    """
    A data representation of a customer's Order
    """
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    user = models.ForeignKey(
        User,
        related_name='orders',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    date = models.DateField(
        auto_now_add=True
    )
    date_time = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(auto_now=True)
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='orders'
    )
    style = models.CharField(
        max_length=150,
        blank=True
    )
    quantity = models.PositiveIntegerField(
        default=0
    )
    num_packs = models.PositiveIntegerField(
        default=0
    )
    half_pack = models.BooleanField(
        default=False
    )
    matching_order = models.OneToOneField(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    items = models.TextField(
        blank=True
    )
    status = models.CharField(
        choices=STATUS_TYPE,
        max_length=32,
        default="Pending"
    )
    processing_date = models.DateTimeField(
        blank=True,
        null=True
    )
    confirmed_date = models.DateTimeField(
        blank=True,
        null=True
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    description = models.TextField(
        blank=True
    )
    salesperson = models.ForeignKey(
        SalesPerson,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders_assigned"
    )

    def save(self, *args, **kwargs):
        self.total = self.product.per_item_price * self.quantity

        # Assign salesperson if user is assigned to them
        if self.user and not self.salesperson:
            assigned_user = AssignedUser.objects.filter(user=self.user).first()
            if assigned_user:
                self.salesperson = assigned_user.salesperson

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.id}"


class Invoice(UUIDModel):
    sid = models.CharField(
        max_length=10,
        blank=True
    )
    user = models.ForeignKey(
        User,
        related_name='invoices',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    orders = models.ManyToManyField(
        Order,
        related_name='invoices'
    )
    tracking_number_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    ) 
    packing_video = models.FileField(
        upload_to='orders/videos',
        blank=True,
        null=True
    )
    file = models.FileField(
        upload_to='orders/invoices',
        blank=True,
        null=True
    )
    sub_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    shipping_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def save(self, *args, **kwargs):
        order_totals = self.orders.aggregate(
            total=Coalesce(Sum('total'), Value(0))
        )['total']
        self.sub_total = order_totals
        self.total = self.sub_total + self.shipping_cost - self.discount

        if not self.sid:
            today = datetime.now()
            new_date = today.strftime("%y%m%d")
            last_invoice = Invoice.objects.filter(created_at__date=today.date()).order_by('created_at').last()
            if not last_invoice:
                uniqueid = "000"
            else:
                uniqueid = str(int(last_invoice.sid[-3:]) + 1)
                uniqueid = uniqueid.zfill(3)
            new_sid = new_date + '-' + uniqueid
            self.sid = new_sid
        super(Invoice, self).save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
