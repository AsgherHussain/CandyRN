from datetime import date, timedelta

from django.db.models import Q, Exists, OuterRef
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from home.filters import ProductFilter
from home.permissions import IsGetOrIsAuthenticated
from orders.models import Order
from products.models import Brand, Category, Product, Photo
from products.serializers import BrandSerializer, CategorySerializer, ProductSerializer
from royal_cloud_33498.settings import MAX_PRODUCT_RANGE
from users.authentication import ExpiringTokenAuthentication


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (IsGetOrIsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Product.objects.all()
    filterset_class = ProductFilter

    def get_queryset(self):
        if not self.request.user.is_authenticated or not self.request.user.is_superuser:
            today = date.today()
            cutoff_date = today - timedelta(days=int(MAX_PRODUCT_RANGE))
            queryset = self.queryset.filter(
                Q(type="Catalog", upload_date__gte=cutoff_date) |
                Q(type="Inventory")
            )
            if not self.request.user.flagged:
                queryset = queryset.annotate(
                    has_pending_order=Exists(
                        Order.objects.filter(
                            product_id=OuterRef('id'),
                            status__in=['Unmatched_Reservation', 'Pending_Reservation']
                        )
                    )
                )
                return queryset.exclude(has_pending_order=True)
            if self.request.query_params.get('half_pack_available') == 'true':
                queryset = queryset.filter(half_pack_available=True)
            return queryset

    @action(detail=False, methods=['delete'])
    def remove_image(self, request):
        image_id = request.data.get('image_id')
        photo = Photo.objects.get(id=image_id)
        serializer = ProductSerializer(photo.product)
        photo.delete()
        return Response(serializer.data)


class BrandViewSet(ModelViewSet):
    serializer_class = BrandSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Brand.objects.all()


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Category.objects.all()
