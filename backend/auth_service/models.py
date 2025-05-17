from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=30, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=30, verbose_name=_("Last Name"))
    
    birth_date = models.DateField(null=True, blank=True, verbose_name=_("Birth Date"))
    cpf = models.CharField(max_length=14, unique=True, verbose_name=_("CPF"))

    inserted_by = models.ForeignKey(
        'self',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='inserted_users',
        verbose_name=_("Inserted By")
    )
    inserted_in = models.DateTimeField(auto_now_add=True, verbose_name=_("Inserted At"))

    modified_by = models.ForeignKey(
        'self',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='modified_users',
        verbose_name=_("Modified By")
    )
    modified_in = models.DateTimeField(auto_now=True, verbose_name=_("Modified At"))

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_authservice_groups",
        blank=True,
        verbose_name=_("Groups")
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_authservice_permissions",
        blank=True,
        verbose_name=_("User Permissions")
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
