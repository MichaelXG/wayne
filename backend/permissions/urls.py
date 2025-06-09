from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PermissionGroupViewSet,
    PermissionMenuViewSet,
    PermissionViewSet,
    PermissionsTreeView,
    save_group_permissions,
    my_permissions
)

router = DefaultRouter()
router.register(r'groups', PermissionGroupViewSet)
router.register(r'menus', PermissionMenuViewSet)
router.register(r'permissions', PermissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tree/', PermissionsTreeView.as_view(), name='permissions-tree'),
    path('save/', save_group_permissions, name='save-group-permissions'),
    path('my/', my_permissions, name='my-permissions'),
]
