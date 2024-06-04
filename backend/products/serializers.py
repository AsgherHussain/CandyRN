from rest_framework import serializers
from .models import Photo, Product
from collections import OrderedDict
from products.models import Brand, Category


class BrandSerializer(serializers.ModelSerializer):
    """
    A data representation of the Brand of a Product
    """
    class Meta:
        model = Brand
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    """
    A data representation of the Brand of a Product
    """
    class Meta:
        model = Category
        fields = '__all__'


class PhotoSerializer(serializers.ModelSerializer):
    """
    A data representation of the multiple Photos of a Product
    """
    class Meta:
        model = Photo
        exclude = ('product',)


class BrandField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        pk = super(BrandField, self).to_representation(value)
        try:
           item = Brand.objects.get(pk=pk)
           serializer = BrandSerializer(item)
           return serializer.data
        except Brand.DoesNotExist:
           return None

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            return {}

        return OrderedDict([(item.id, str(item)) for item in queryset])


class CategoryField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        pk = super(CategoryField, self).to_representation(value)
        try:
           item = Category.objects.get(pk=pk)
           serializer = CategorySerializer(item)
           return serializer.data
        except Category.DoesNotExist:
           return None

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            return {}

        return OrderedDict([(item.id, str(item)) for item in queryset])


class ProductSerializer(serializers.ModelSerializer):
    """
    A data representation of the Products
    """
    brand = BrandField(queryset=Brand.objects.all(), required=False)
    category = CategoryField(queryset=Category.objects.all(), required=False)
    photos = PhotoSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = '__all__'


    def create(self, validated_data):
        photos = validated_data.pop('photos', None)
        product = super().create(validated_data)
        for photo in photos:
            Photo.objects.create(product=product, **photo)
        return product

    def update(self, instance, validated_data):
        photos = validated_data.pop('photos', None)
        product = super().update(instance, validated_data)
        if photos:
            for photo in photos:
                Photo.objects.create(product=product, **photo)
        return product


class ProductField(serializers.PrimaryKeyRelatedField):
    def to_representation(self, value):
        pk = super(ProductField, self).to_representation(value)
        try:
           item = Product.objects.get(pk=pk)
           serializer = ProductSerializer(item)
           return serializer.data
        except Product.DoesNotExist:
           return None

    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            return {}

        return OrderedDict([(item.id, str(item)) for item in queryset])
