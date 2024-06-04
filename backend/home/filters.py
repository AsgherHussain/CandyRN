from django.db.models import Q
from django_filters import FilterSet, CharFilter, DateFilter, NumberFilter
from django_filters import rest_framework as filters
from rest_framework.serializers import ValidationError

from django_filters.constants import EMPTY_VALUES
from products.models import Product


class ProductFilter(FilterSet):
    min_date = DateFilter(field_name='upload_date', lookup_expr='gte')
    max_date = DateFilter(field_name='upload_date', lookup_expr='lte')
    min_price = NumberFilter(field_name='per_item_price', lookup_expr='gte')
    max_price = NumberFilter(field_name='per_item_price', lookup_expr='lte')
    styles = CharFilter(lookup_expr='icontains')
    category = CharFilter(method='category_filter')
    brand = CharFilter(method='brand_filter')

    class Meta:
         model = Product
         fields = ['category', 'half_pack_available', 'type', 'brand', 'styles', 'min_date', 'max_date',
                   'min_price','max_price']

    def category_filter(self, queryset, name, value):
        query = Q()
        for category in value.split(","):
            query |= Q(category__id__contains=category)
        return queryset.filter(query)

    def brand_filter(self, queryset, name, value):
        query = Q()
        for brand in value.split(","):
            query |= Q(brand__id__contains=brand)
        return queryset.filter(query)
