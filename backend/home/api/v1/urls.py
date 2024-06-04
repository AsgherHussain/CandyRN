from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from customadmin.views import AdminInvoiceViewSet, AdminOrdersViewSet, AdminProductOrdersViewSet
from dropdowns.views import ColorsViewSet, SizeViewSet
from feedback.views import FeedbackViewSet
from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    testUser, get_user
)
from notifications.views import BroadcastViewSet, NotificationViewSet
from orders.views import CartViewSet, OrderViewSet
from products.views import BrandViewSet, CategoryViewSet, ProductViewSet
from salesperson.views import SalesPersonView, AssignedUserView, delete_assigned_user

from salesperson.views import get_salespersons, assign_salesperson, \
    get_assigned_salesperson

from users.viewsets import UserViewSet

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewSet, basename="users")
router.register("orders", OrderViewSet, basename="orders")
router.register("cart", CartViewSet, basename="cart")
router.register("products", ProductViewSet, basename="products")
router.register("brands", BrandViewSet, basename="brands")
router.register("categories", CategoryViewSet, basename="categories")
router.register("feedback", FeedbackViewSet, basename="feedback")
router.register("notifications", NotificationViewSet, basename="notifications")
router.register("broadcasts", BroadcastViewSet, basename="broadcasts")
router.register("admin/orders", AdminProductOrdersViewSet, basename="admin_orders")
router.register("admin/invoices", AdminInvoiceViewSet, basename="admin_invoices")
router.register("admin/confirmed-orders", AdminOrdersViewSet, basename="admin_confirmed_orders")
router.register("colors", ColorsViewSet, basename="colors")
router.register("sizes", SizeViewSet, basename="sizes")
router.register("sales_person", SalesPersonView, basename="sales_person")
router.register("assigned_user", AssignedUserView, basename="assigned_user")


app_name = "home_app"


urlpatterns = [
    url("test-user", testUser),
    path("", include(router.urls)),
    path("get-user/<uuid:pk>/", get_user, name="user_detail"),
    path('api/salespersons/', get_salespersons, name='get_salespersons'),
    path('api/assign_salesperson/', assign_salesperson, name='assign_salesperson'),
    path('api/get_assigned_salesperson/', get_assigned_salesperson, name='get_assigned_salesperson'),
    path('api/delete_assigned_user/', delete_assigned_user, name='delete_assigned_user'),
]
