from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PermissionGroupViewSet,
    MyPermissionsView,
    PermissionsTreeView,
    save_group_permissions  
)

router = DefaultRouter()
router.register(r'groups', PermissionGroupViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # 🔐 Permissões do usuário logado (mescladas)
    # path('permissions/my/', MyPermissionsView.as_view(), name='my-permissions'),
    path('my-permissions/', MyPermissionsView.as_view(), name='my-permissions'),

    # 🌳 Permissões estruturadas para RichTreeView
    # path('permissions/tree/', PermissionsTreeView.as_view(), name='permissions-tree'),
    path("treeview-permissions/", PermissionsTreeView.as_view(), name="treeview-permissions"),

    # 💾 Endpoint para salvar permissões de um grupo
    path('permissions/save/', save_group_permissions, name='save-group-permissions'),
]
