from django_filters import NumberFilter, FilterSet, CharFilter

from django.db.models import Q

from orders.models import Order


class OrderFilter(FilterSet):
    status = CharFilter(method='status_filter')

    class Meta:
        model = Order
        fields = ['user', 'date', 'product', 'half_pack', 'status']

    def status_filter(self, queryset, name, value):
        query = Q()
        for status in value.split(","):
            query |= Q(status=status)
        return queryset.filter(query)  
