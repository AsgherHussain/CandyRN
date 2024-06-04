from django.db import models
from home.constants import PRODUCT_TYPE, SIZE_VARIANCE
from home.models import UUIDModel
from django.contrib.postgres.fields import ArrayField, JSONField
from shortuuid.django_fields import ShortUUIDField
from shortuuid import uuid

from datetime import datetime


class Brand(UUIDModel):
    """
    A data representation of the brands used by the Admin
    """
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Category(UUIDModel):
    """
    A data representation of the various product categories
    """
    name = models.CharField(max_length=150)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(UUIDModel):
    """
    A data represention of the products available for sale
    """
    sid = models.CharField(
        max_length=10,
        blank=True
    )
    brand = models.ForeignKey(Brand,
                              on_delete=models.SET_NULL,
                              related_name='products',
                              blank=True,
                              null=True)
    category = models.ForeignKey(Category,
                                 on_delete=models.SET_NULL,
                                 related_name='products',
                                 blank=True,
                                 null=True)
    per_pack_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    per_item_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    styles = ArrayField(models.CharField(max_length=32, blank=True), null=True, blank=True)
    half_pack_available = models.BooleanField(default=False)
    half_pack_orders = JSONField(blank=True, default=dict)
    half_pack_styles = ArrayField(models.CharField(max_length=32, blank=True), null=True, blank=True)
    size_variance = models.CharField(max_length=255, blank=True, default='2S 2M 2L')
    type = models.CharField(choices=PRODUCT_TYPE, max_length=32)
    stock = models.PositiveIntegerField(default=0)
    description = models.TextField(
        blank=True
    )
    upload_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-upload_date']

    def save(self, *args, **kwargs):
        if not self.sid:
            today = datetime.now()
            new_date = today.strftime("%y%m%d")
            last_product = Product.objects.filter(upload_date__date=today.date()).order_by('upload_date').last()
            if not last_product:
                uniqueid = "000"
            else:
                uniqueid = str(int(last_product.sid[-3:]) + 1)
                uniqueid = uniqueid.zfill(3)
            new_sid = new_date + '-' + uniqueid
            self.sid = new_sid
        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.sid


class Photo(UUIDModel):
    """
    A data representation of the multiple photos in a product
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='products/images')
