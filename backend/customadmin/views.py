from datetime import datetime
from decimal import Decimal

from django.db.models import (Count, Sum, Q, Value, F, Prefetch, Case, When, Max)
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from customadmin.serializers import AdminOrderSerializer, AdminProductSerializer, InvoiceSerializer
from home.api.v1.paginations import CustomLimitOffsetPagination
from home.utility import send_invoice, send_notification
from orders.models import Invoice, Order
from orders.serializers import OrderSerializer
from products.models import Product
from users.authentication import ExpiringTokenAuthentication


class AdminInvoiceViewSet(ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Invoice.objects.all()


class AdminOrdersViewSet(ModelViewSet):
    serializer_class = AdminOrderSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]

    def get_queryset(self):
        return Order.objects.filter(status="Confirmed").exclude(product__isnull=True).order_by(
            'confirmed_date').select_related('user').annotate(
            customer_count=Count('user', distinct=True),
            quantity_count=Sum('quantity'),
            amount_count=Sum('total'),
        )


class AdminProductOrdersViewSet(ModelViewSet):
    serializer_class = AdminProductSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Product.objects.all()

    def get_queryset(self):
        qs = super().get_queryset()
        half_pack = self.request.query_params.get('half_pack', False)
        return qs.filter(
            orders__status="Pending",
            orders__half_pack=half_pack
        ).order_by('styles')

    @action(detail=False, methods=['get'])
    def list_product_orders(self, request):
        half_pack_str = request.query_params.get('half_pack', 'false')
        half_pack = None if half_pack_str is None else half_pack_str.lower() == 'true'
        processing = request.query_params.get('processing', 'false').lower() == 'true'
        order_status = ["Processing"] if processing else ["Pending"]
        orders_query = Order.objects.filter(status__in=order_status)
        if half_pack:
            order_status = ['Pending', 'Unmatched']
            orders_query = Order.objects.filter(status__in=order_status)
            orders_query = orders_query.filter(half_pack=half_pack)
            orders_prefetch = Prefetch('orders', queryset=orders_query, to_attr='filtered_orders')

            products = Product.objects.filter(
                orders__status__in=order_status,
                half_pack_available=True
            ).annotate(
                ord=Max('orders__date_time')
            ).prefetch_related(
                orders_prefetch
            ).order_by(
                '-ord'
            )
        else:
            orders_prefetch = Prefetch('orders', queryset=orders_query, to_attr='filtered_orders')

            products = Product.objects.filter(
                orders__status__in=order_status,
            ).annotate(
                ord=Max('orders__date_time')
            ).prefetch_related(
                orders_prefetch
            ).order_by(
                '-ord'
            )
        if processing:
            products = products.order_by('-sid')
        month = request.query_params.get('month')
        today = datetime.now()
        if month:
            year, month = map(int, month.split('-'))
            products = products.filter(orders__date__year=year, orders__date__month=month)
        else:
            # Filter by current month by default
            products = products.filter(orders__date__year=today.year, orders__date__month=today.month)

        paginator = CustomLimitOffsetPagination()
        page = paginator.paginate_queryset(products, request)

        resp = []
        for product in page:
            for style in set(order.style for order in product.filtered_orders):
                orders = product.filtered_orders
                if half_pack:
                    orders = [order for order in orders if order.quantity == 3]
                    orders = [orders.pop()]
                order_ids = [order.id for order in orders if order.style == style]
                totals = Order.objects.filter(
                    id__in=order_ids
                ).aggregate(
                    customer_count=Count('user', distinct=True),
                    quantity_count=Sum('quantity'),
                    amount_count=Sum('total')
                )
                totals['order_ids'] = order_ids  # add this line
                totals['style'] = style
                totals['pack_count'] = int(totals['quantity_count'] / 6) if totals['quantity_count'] else 0
                serializer = AdminProductSerializer(product).data
                serializer['totals'] = totals
                resp.append(serializer)
        return paginator.get_paginated_response(resp)

    @action(detail=False, methods=['get'])
    def list_reservation_pending_product_orders(self, request):
        half_pack_str = request.query_params.get('half_pack')
        half_pack = None if half_pack_str is None else half_pack_str.lower() == 'true'
        orders_query = Order.objects.filter(Q(status='Pending_Reservation'))
        if half_pack is not None:
            orders_query = Order.objects.filter(Q(status='Pending_Reservation') | Q(status='Unmatched_Reservation'))
            orders_query = orders_query.filter(half_pack=half_pack)
        orders_prefetch = Prefetch('orders', queryset=orders_query, to_attr='filtered_orders')

        products = Product.objects.filter(
            Q(orders__status='Pending_Reservation') | Q(orders__status='Unmatched_Reservation')).prefetch_related(
            orders_prefetch).annotate(
            ord=Max('orders__date_time')
        ).order_by(
            '-ord', 'sid'
        )
        month = request.query_params.get('month')
        today = datetime.now()
        if month:
            year, month = map(int, month.split('-'))
            products = products.filter(orders__date__year=year, orders__date__month=month)
        else:
            # Filter by current month by default
            products = products.filter(orders__date__year=today.year, orders__date__month=today.month)

        paginator = CustomLimitOffsetPagination()
        page = paginator.paginate_queryset(products, request)

        resp = []
        for product in page:
            for style in set(order.style for order in product.filtered_orders):
                order_ids = [order.id for order in product.filtered_orders if order.style == style]
                totals = Order.objects.filter(
                    id__in=[order.id for order in product.filtered_orders if order.style == style]
                ).distinct().aggregate(
                    customer_count=Count('user', distinct=True),
                    quantity_count=Sum('quantity'),
                    amount_count=Sum('total')
                )
                totals['order_ids'] = order_ids  # add this line
                totals['style'] = style
                totals['pack_count'] = int(totals['quantity_count'] / 6) if totals['quantity_count'] else 0
                serializer = AdminProductSerializer(product).data
                serializer['totals'] = totals
                resp.append(serializer)

        return paginator.get_paginated_response(resp)

    @action(detail=False, methods=['get'])
    def invoice_list(self, request):
        id = request.query_params.get('id')
        style = request.query_params.get('style')
        processing = request.query_params.get('processing', False)
        reservation = request.query_params.get('reservation', False)
        if not reservation:
            if processing == "True" or processing == "true" or processing == True:
                order_status = ["Processing"]
            else:
                order_status = ["Pending", "Unmatched"]
        else:
            order_status = ['Pending_Reservation', 'Unmatched_Reservation']
        product = Product.objects.get(id=id)
        orders = Order.objects.filter(product=product, status__in=order_status, style=style)
        totals = orders.aggregate(
            customer_count=Count('user', distinct=True),
            quantity_count=Sum('quantity'),
            amount_count=Sum('total')
        )
        totals['style'] = style
        if totals['quantity_count'] is not None:
            totals['pack_count'] = int(totals['quantity_count'] / 6)
        else:
            totals['pack_count'] = 0
        totals['order_ids'] = list(orders.values_list('id', flat=True))  # add this line

        product_serializer = AdminProductSerializer(product).data
        product_serializer['totals'] = totals

        orders = Order.objects.filter(
            product=product,
            status__in=order_status,
            style=style
        )
        order_serializer = OrderSerializer(orders, many=True).data
        return Response(
            {
                'product_info': product_serializer,
                'order_list': order_serializer
            }
        )

    @action(detail=False, methods=['get'])
    def processing(self, request):
        ids = request.query_params.get('ids')
        ids = ids.split(',')
        Order.objects.filter(
            pk__in=ids
        ).update(status="Processing", processing_date=timezone.now())
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def approve_pending_reservation(self, request):
        ids = request.data.get("ids")
        ids = ids.split(',')
        order = Order.objects.filter(id=request.data.get('ids')).first()
        quantity = order.quantity
        product_id = order.product_id
        flagged = order.user.flagged
        instance = Product.objects.get(id=product_id)
        if flagged:
            if instance.type == "Catalog":
                if quantity % 6 == 3:
                    # If there is a half pack match, create a pending order
                    if instance.half_pack_available and order.style in instance.half_pack_styles:
                        matching_order_id = instance.half_pack_orders.pop(order.style)
                        matching_order = Order.objects.get(id=matching_order_id)
                        if 'Unmatched_Reservation' in matching_order.status:
                            matching_order.status = "Pending"
                        elif matching_order.status == 'Unmatched':
                            matching_order.status = "Pending"
                        matching_order.save()
                        notif_user = matching_order.user
                        send_notification(
                            user=notif_user,
                            title="Half Pack Confirmation",
                            content="Your order has been submitted and pending shipment"
                        )

                        if quantity == 3:
                            order.half_pack = True
                            order.matching_order = matching_order
                            order.total = instance.per_item_price * quantity
                            order.product = instance


                        # If quantity is not 3
                        else:
                            Order.objects.create(
                                user=order.user,
                                transaction=order.transaction,
                                product=order.product,
                                style=order.style,
                                quantity=3,
                                half_pack=True,
                                matching_order=matching_order,
                                items=instance.size_variance,
                                status="Pending",
                                total=instance.per_item_price * Decimal(3)
                            )
                            order.quantity -= 3
                            order.total = instance.per_item_price * Decimal(order.quantity)

                        order.status = "Pending"

                        instance.half_pack_styles.remove(order.style)
                        if len(instance.half_pack_styles) == 0:
                            instance.half_pack_available = False
                        instance.save()

                    # If there is no available half pack match, create an unmatched order
                    else:
                        if quantity == 3:
                            order.half_pack = True
                            order.total = instance.per_item_price * Decimal(3)
                            half_pack_order_id = str(order.id)

                        # If quantity is not 3
                        else:
                            half_pack_order = Order.objects.create(
                                user=order.user,
                                transaction=order.transaction,
                                product=order.product,
                                style=order.style,
                                quantity=3,
                                half_pack=True,
                                items=instance.size_variance,
                                status="Unmatched",
                                total=instance.per_item_price * Decimal(3)
                            )
                            half_pack_order_id = str(half_pack_order.id)

                            order.quantity -= 3
                            order.total = instance.per_item_price * Decimal(order.quantity)

                        order.status = "Unmatched"

                        if instance.half_pack_styles is None:
                            instance.half_pack_styles = []

                        instance.half_pack_styles.append(order.style)
                        instance.half_pack_available = True
                        instance.half_pack_orders[order.style] = half_pack_order_id
                        instance.save()

                    quantity -= 3

                if quantity and quantity % 6 == 0:
                    order.status = "Pending"
                    order.items = instance.size_variance
                    order.quantity = quantity
                    order.total = instance.per_item_price * Decimal(order.quantity)
                order.save()

        Order.objects.filter(
            Q(pk__in=ids, status='Pending_Reservation') |
            Q(pk__in=ids, status='Unmatched_Reservation')
        ).update(
            status=Case(
                When(status='Pending_Reservation', then=Value('Pending')),
                When(status='Unmatched_Reservation', then=Value('Unmatched')),
                default=F('status'),
            )
        )

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def cancel_pending_reservation(self, request):
        ids = request.data.get("ids")
        ids = ids.split(',')
        Order.objects.filter(
            pk__in=ids
        ).update(status="Cancelled")
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def confirm(self, request):
        ids = request.query_params.get('ids')
        ids = ids.split(',')
        Order.objects.filter(
            pk__in=ids
        ).update(status="Confirmed", confirmed_date=timezone.now())
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def generate_invoice(self, request):
        ids = request.query_params.get('ids')
        ids = ids.split(',')

        if Invoice.objects.filter(orders__in=ids).exists():
            return Response(
                "An order in this list already has an invoice",
                status=status.HTTP_400_BAD_REQUEST
            )

        orders = Order.objects.filter(pk__in=ids)
        invoice = Invoice.objects.create(
            user=orders[0].user
        )
        invoice.orders.set(orders)
        orders.update(status="Completed")

        invoice.save()  # Done to recalculate order totals in def save()

        serializer = InvoiceSerializer(
            invoice
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def submit_invoice(self, request):
        id = request.query_params.get('id')
        invoice = Invoice.objects.get(pk=id)

        if not invoice.file:
            return Response({
                'detail': "Invoice does not have an image attached"
            }, status=status.HTTP_400_BAD_REQUEST)

        send_invoice(user=invoice.user, invoice=invoice.file.url)
        return Response(status=status.HTTP_200_OK)
