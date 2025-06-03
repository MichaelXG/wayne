from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from django.db.models import Prefetch

from .models import PermissionGroup, PermissionMenu, Permission, UserPermission
from .serializers import (
    PermissionGroupSerializer,
    PermissionMenuSerializer,
    PermissionSerializer,
    SimplePermissionGroupSerializer
)

# ========================================================
# 📦 CRUD: PermissionGroup
# ========================================================
class PermissionGroupViewSet(viewsets.ModelViewSet):
    queryset = PermissionGroup.objects.all()  
    serializer_class = SimplePermissionGroupSerializer  
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

# ========================================================
# 📦 CRUD: PermissionMenu
# ========================================================
class PermissionMenuViewSet(viewsets.ModelViewSet):
    queryset = PermissionMenu.objects.all()

    serializer_class = PermissionMenuSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]


# ========================================================
# 📦 CRUD: Permission
# ========================================================
class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.select_related('menu')
    serializer_class = PermissionSerializer
  
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

# ========================================================
# 🌳 View: Estrutura RichTreeView (para frontend)
# ========================================================
class PermissionsTreeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tree_data = []

        groups = PermissionGroup.objects.prefetch_related(
            Prefetch(
                'permissions',
                queryset=Permission.objects.select_related('menu')
            )
        )

        for group in groups:
            group_node = {
                "id": f"group-{group.id}",
                "label": group.name,
                "type": "group",
                "children": []
            }

            menu_map = {}
            for perm in group.permissions.all():
                if perm.menu.id not in menu_map:
                    menu_map[perm.menu.id] = {
                        "id": f"menu-{perm.menu.id}",
                        "label": perm.menu.name.capitalize(),
                        "type": "menu",
                        "children": []
                    }

                for action in [
                    "can_create", "can_read", "can_update",
                    "can_delete", "can_secret",
                    "can_export", "can_import", "can_download", "can_upload"
                ]:
                    menu_map[perm.menu.id]["children"].append({
                        "id": f"perm-{perm.menu.id}-{action}",
                        "label": action.replace("can_", "").capitalize(),
                        "type": "permission",
                        "checked": getattr(perm, action, False),
                        "permissionKey": action,
                        "menu_name": perm.menu.name,
                        "groupId": group.id
                    })

            group_node["children"].extend(menu_map.values())
            tree_data.append(group_node)

        return Response(tree_data, status=status.HTTP_200_OK)

# ========================================================
# 💾 View: Salvar ou atualizar permissões de um grupo
# ========================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_group_permissions(request):
    data = request.data
    group_id = data.get("groupId")
    permissions_data = data.get("permissions", [])

    if not group_id or not permissions_data:
        return Response({"detail": "Missing groupId or permissions."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        group = PermissionGroup.objects.get(id=group_id)
    except PermissionGroup.DoesNotExist:
        return Response({"detail": "Permission group not found."}, status=status.HTTP_404_NOT_FOUND)

    for item in permissions_data:
        menu_name = item.get("menu_name")
        if not menu_name:
            continue

        # Cria ou atualiza o menu
        menu, _ = PermissionMenu.objects.get_or_create(name=menu_name)

        # Cria ou atualiza as permissões do menu
        permission_defaults = {
            "can_create": item.get("can_create", False),
            "can_read": item.get("can_read", False),
            "can_update": item.get("can_update", False),
            "can_delete": item.get("can_delete", False),
            "can_secret": item.get("can_secret", False),
            "can_export": item.get("can_export", False),
            "can_import": item.get("can_import", False),
            "can_download": item.get("can_download", False),
            "can_upload": item.get("can_upload", False),
        }

        Permission.objects.update_or_create(menu=menu, defaults=permission_defaults)

    return Response({"detail": "Permissions saved successfully."}, status=status.HTTP_200_OK)


# ========================================================
# 🔐 View: Permissões do usuário autenticado
# ========================================================
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def my_permissions(request):
    try:
        user_perm = UserPermission.objects.prefetch_related('groups__permissions__menu').get(user=request.user)
        groups = request.user.groups.prefetch_related('permissions__menu').all()
        if not groups:
            return Response({"detail": "No permission groups associated with this user."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PermissionGroupSerializer(groups, many=True)
        return Response({"permissions": serializer.data}, status=status.HTTP_200_OK)
    except UserPermission.DoesNotExist:
        return Response({"detail": "No permission group associated with this user."}, status=status.HTTP_404_NOT_FOUND)

