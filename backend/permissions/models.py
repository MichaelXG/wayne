from django.db import models
from django.conf import settings

class Permission(models.Model):
    """
    Represents permission for a specific menu.
    """
    menu_name = models.CharField(max_length=50, unique=True)  # Ex.: 'products', 'orders'
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_update = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.menu_name} (V:{self.can_view} C:{self.can_create} U:{self.can_update} D:{self.can_delete})"

    class Meta:
        db_table = "permission"
        verbose_name = "Permission"
        verbose_name_plural = "Permissions"
        indexes = [
            models.Index(fields=["menu_name"], name="permission_menu_idx"),
        ]


class PermissionGroup(models.Model):
    """
    Group with multiple permissions across different menus.
    """
    name = models.CharField(max_length=50, unique=True)  # Exemplo: "Funcionários", "Gerentes"
    permissions = models.ManyToManyField(Permission, related_name='groups')

    def __str__(self):
        return self.name

    class Meta:
        db_table = "permission_group"
        verbose_name = "Permission Group"
        verbose_name_plural = "Permission Groups"
        indexes = [
            models.Index(fields=["name"], name="perm_group_name_idx"),
        ]


class UserPermission(models.Model):
    """
    Link between User and Group.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(
        PermissionGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.user.username} -> {self.group.name if self.group else 'No Group'}"

    class Meta:
        db_table = "user_permission"
        verbose_name = "User Permission"
        verbose_name_plural = "User Permissions"
        indexes = [
            models.Index(fields=["user"], name="user_perm_user_idx"),
            models.Index(fields=["group"], name="user_perm_group_idx"),
        ]
