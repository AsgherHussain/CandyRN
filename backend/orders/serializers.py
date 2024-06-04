from decimal import Decimal

from rest_framework import serializers

from home.utility import send_notification
from products.models import Product
from products.serializers import ProductField
from .models import Order, CartOrder, Cart


class OrderSerializer(serializers.ModelSerializer):
    """
    A data representation of the Order Object
    """
    product = ProductField(queryset=Product.objects.all(), required=False)
    style = serializers.CharField(max_length=64, required=False)

    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {'product': {'required': False},
                        'style': {'required': False},
                        'transaction': {'required': False}}

    def create(self, validated_data):
        quantity = validated_data['quantity']
        product = validated_data['product']
        style = validated_data['style']
        user = validated_data.get('user')
        flagged = user.flagged
        if style not in product.styles:
            raise serializers.ValidationError("Invalid Style")
        order = super().create(validated_data)
        if product.type == "Catalog":
            # Check if Order includes a Half Pack
            if not flagged:
                if quantity % 6 == 3:
                    # If there is a half pack match, create a pending order
                    if product.half_pack_available and style in product.half_pack_styles:
                        matching_order_id = product.half_pack_orders.pop(style)
                        matching_order = Order.objects.get(id=matching_order_id)
                        if 'Unmatched_Reservation' in matching_order.status:
                            matching_order.status = "Pending_Reservation"
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
                            order.total = product.per_item_price * quantity
                            order.product = product


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
                                items=product.size_variance,
                                status="Pending",
                                total=product.per_item_price * Decimal(3)
                            )
                            order.quantity -= 3
                            order.total = product.per_item_price * Decimal(order.quantity)

                        order.status = "Pending"

                        product.half_pack_styles.remove(style)
                        if len(product.half_pack_styles) == 0:
                            product.half_pack_available = False
                        product.save()

                    # If there is no available half pack match, create an unmatched order
                    else:
                        if quantity == 3:
                            order.half_pack = True
                            order.total = product.per_item_price * Decimal(3)
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
                                items=product.size_variance,
                                status="Unmatched",
                                total=product.per_item_price * Decimal(3)
                            )
                            half_pack_order_id = str(half_pack_order.id)

                            order.quantity -= 3
                            order.total = product.per_item_price * Decimal(order.quantity)

                        order.status = "Unmatched"

                        if product.half_pack_styles is None:
                            product.half_pack_styles = []

                        product.half_pack_styles.append(style)
                        product.half_pack_available = True
                        product.half_pack_orders[style] = half_pack_order_id
                        product.save()

                    quantity -= 3

                if quantity and quantity % 6 == 0:
                    order.status = "Pending"
                    order.items = product.size_variance
                    order.quantity = quantity
                    order.total = product.per_item_price * Decimal(order.quantity)
            elif flagged:
                if product.half_pack_available:
                    order.half_pack = True
                elif not product.half_pack_available:
                    order.half_pack = False
                order.status = "Pending_Reservation"
        elif product.type == "Inventory":
            if product.stock < int(quantity):
                order.delete()
                raise serializers.ValidationError(
                    f'Product #{product.sid} has insufficient stock to fulfill this order')
            product.stock -= quantity
            product.save()
            order.status = "Pending_Reservation" if flagged else "Pending"
            order.items = product.size_variance
            order.quantity = quantity
            order.total = product.per_item_price * quantity

        order.save()
        return order

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        from users.serializers import UserProfileSerializer
        if instance.user:
            rep['user'] = UserProfileSerializer(instance.user).data
        rep['invoice'] = None
        if hasattr(instance, 'invoices'):
            invoice = instance.invoices.first()
            if invoice is not None:
                rep['invoice'] = invoice.id
            else:
                rep['invoice'] = None
        return rep


class CartOrderSerializer(serializers.ModelSerializer):
    """
    A data representation of the temporary orders inside a cart
    """
    product = ProductField(queryset=Product.objects.all())

    class Meta:
        model = CartOrder
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    """
    A data representation of the temporary cart of a User
    """
    orders = CartOrderSerializer(many=True, required=False)

    class Meta:
        model = Cart
        fields = '__all__'
