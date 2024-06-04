from decimal import Decimal
from rest_framework import status, filters
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from django.db.models import Sum
from orders.filters import OrderFilter
from orders.models import Cart, CartOrder, Order, Transaction
from orders.serializers import CartSerializer, OrderSerializer
from products.models import Product
from users.authentication import ExpiringTokenAuthentication
from rest_framework.permissions import IsAuthenticated

from home.utility import send_cancel_email


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Order.objects.all().exclude(product__isnull=True)
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filter_class = OrderFilter
    ordering_fields = ['date', 'status', 'product', 'half_pack', 'status', 'sid']


    def perform_create(self, serializer):
        order = serializer.save(
            user=self.request.user)

    @action(detail=False, methods=['get'])
    def calculate_total(self, request):
        user_id = request.query_params.get('user', None)
        statuses = request.query_params.get('status', None)

        status_list = statuses.split(',')

        total = Order.objects.filter(user_id=user_id, status__in=status_list).aggregate(Sum('total'))['total__sum']

        return Response({'total': total if total is not None else '0.00'})


class CartViewSet(ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Cart.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        product_id = request.data.get('product')
        quantity = int(request.data.get('quantity'))
        style = request.data.get('style')
        product = Product.objects.get(id=product_id)
        if style not in product.styles:
            return Response(
                {
                    'detail': 'Invalid Style Choice'
                }, status=status.HTTP_400_BAD_REQUEST
            )
        total_cost = product.per_item_price * quantity
        try:
            existing_order = CartOrder.objects.get(cart=user.cart, product=product, style=style)
        except CartOrder.DoesNotExist:
            CartOrder.objects.create(
                cart=user.cart,
                product=product,
                style=style,
                quantity=quantity,
                total=total_cost
            )
        else:
            existing_order.quantity += quantity
            existing_order.total += total_cost
            existing_order.save()
        user.cart.total += total_cost
        user.cart.save()
        serializer = CartSerializer(user.cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def clear(self, request):
        cart = request.user.cart
        cart.total = 0
        cart.save()
        CartOrder.objects.filter(cart=cart).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        cart = request.user.cart
        item = request.data.get('item')
        try:
            item = CartOrder.objects.get(id=item)
        except CartOrder.DoesNotExist:
            return Response({'detail': 'Invalid Item ID'}, status=status.HTTP_400_BAD_REQUEST)
        price = item.total
        item.delete()
        cart.total -= price
        cart.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def submit(self, request):
        user = request.user
        cart = user.cart
        transaction = Transaction.objects.create(user=user)
        for cart_order in cart.orders.all():
            data = {
                "user": user.id,
                "quantity": cart_order.quantity,
                "product": cart_order.product.id,
                "style": cart_order.style
                }
            serializer = OrderSerializer(data=data)
            if serializer.is_valid():
                # Delete the cart order object
                cart_order.delete()
                # Save the actual Order object
                serializer.save(transaction=transaction)
            else:
                transaction.delete()
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        cart.total = 0
        cart.save()
        serializer = OrderSerializer(transaction.orders.all().order_by('product'), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def cancel_order(self, request):
        order = Order.objects.get(id=request.query_params.get('order'))
        if order.half_pack and order.matching_order:
            order.matching_order.status = 'Unmatched'
            order.matching_order.save()
            order.matching_order = None
            style = order.style
            product = order.product
            if style not in product.half_pack_styles:
                product.half_pack_styles.append(style)
            product.half_pack_available = True
            product.save(update_fields=['half_pack_styles', 'half_pack_available'])
        elif order.half_pack:
            style = order.style
            product = order.product
            if style in product.half_pack_styles:
                product.half_pack_styles.remove(style)
            product.half_pack_orders.pop(style)
            product.half_pack_available = False
            product.save(update_fields=['half_pack_styles', 'half_pack_available', 'half_pack_orders'])
        order.status = 'Cancelled'
        order.save()

        if order.user.email:
            send_cancel_email(order.user.email)
        return Response("Order cancelled successfully", status=status.HTTP_200_OK)
