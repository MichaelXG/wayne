from rest_framework.permissions import BasePermission
from .models import UserPermission

class GroupMenuPermission(BasePermission):
    """
    Checks if the authenticated user's group has permission for the given menu and action.
    """

    def has_permission(self, request, view):
        # ✅ Superuser always has permission
        if request.user and request.user.is_superuser:
            return True
        
        # ✅ Block unauthenticated users
        if not request.user or not request.user.is_authenticated:
            return False

        menu = getattr(view, 'menu_name', None)
        if not menu:
            return False

        try:
            user_perm = UserPermission.objects.get(user=request.user)
            group = user_perm.group

            if not group:
                return False

            # ✅ Busca a permissão do grupo para o menu atual
            permission = group.permissions.filter(menu_name=menu).first()

            if not permission:
                return False

            # ✅ Verifica a ação
            if view.action == 'list' and permission.can_view:
                return True
            if view.action == 'create' and permission.can_create:
                return True
            if view.action in ['update', 'partial_update'] and permission.can_update:
                return True
            if view.action == 'destroy' and permission.can_delete:
                return True

            return False

        except UserPermission.DoesNotExist:
            return False
