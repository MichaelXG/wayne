from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    OrderViewSet,
    OrderDeliveryViewSet,
    OrderShippingViewSet,
    OrderPaymentViewSet,
    TotalEarningView,
    OrderTotalByPeriodView,
    TotalIncomeView,
    TotalOrdersByStatusView,
    OrderStatusGrowthView
)

router = DefaultRouter()
router.register('orders', OrderViewSet, basename='orders')
router.register(r'order-delivery', OrderDeliveryViewSet, basename='order-delivery')
router.register(r'order-shipping', OrderShippingViewSet, basename='order-shipping')
router.register(r'order-payment', OrderPaymentViewSet, basename='order-payment')

urlpatterns = [
    path('', include(router.urls)),

    # ✅ Dashboard
    path('total-earning/', TotalEarningView.as_view(), name='total-earning'),
    path('total-orders/', OrderTotalByPeriodView.as_view(), name='total-orders'),
    path('total-income/', TotalIncomeView.as_view(), name='total-income'),
    path('total-by-status/', TotalOrdersByStatusView.as_view(), name='orders-by-status'),
    path('orders-growth-status/', OrderStatusGrowthView.as_view(), name='orders-growth-status'),
]
