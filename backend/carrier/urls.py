from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarrierViewSet

router = DefaultRouter()
router.register(r'', CarrierViewSet, basename='carrier')

urlpatterns = [
    path('', include(router.urls)),
]
