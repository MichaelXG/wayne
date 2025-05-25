from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PermissionGroupViewSet, MyPermissionsView

router = DefaultRouter()
router.register(r'groups', PermissionGroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('my-permissions/', MyPermissionsView.as_view(), name='my-permissions'),
]
