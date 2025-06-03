from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.conf import settings
from permissions.models import PermissionGroup

import os

# 🔒 Image size validation (max 3MB)
def validate_image_size(image):
    if image.size > 3 * 1024 * 1024:
        raise ValidationError("Image too large. Maximum size is 3MB.")

# 📁 Custom path for avatar upload
def avatar_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return os.path.join("users", "avatars", f"user-{instance.user.id}-avatar{ext}")

class CustomUserManager(BaseUserManager):
    def create_user(self, first_name, last_name, email, birth_date, cpf, phone, password=None, **extra_fields):
        if not first_name:
            raise ValueError("⚠️ The 'first_name' field is required.")
        if not last_name:
            raise ValueError("⚠️ The 'last_name' field is required.")
        if not email:
            raise ValueError("⚠️ The 'email' field is required.")
        if not birth_date:
            raise ValueError("⚠️ The 'birth_date' field is required.")
        if not cpf:
            raise ValueError("⚠️ The 'cpf' field is required.")
        if not phone:
            raise ValueError("⚠️ The 'phone' field is required.")

        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)

        # ✅ Permitir passar group no extra_fields
        groups = extra_fields.pop("groups", [])

        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=email,
            birth_date=birth_date,
            cpf=cpf,
            phone=phone,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        
        # ✅ Atribuir grupos após salvar
        if groups:
            user.groups.set(groups)
            
        return user

    def create_superuser(self, first_name, last_name, email, birth_date, cpf, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields["is_staff"]:
            raise ValueError("⚠️ Superuser must have is_staff=True.")
        if not extra_fields["is_superuser"]:
            raise ValueError("⚠️ Superuser must have is_superuser=True.")

        return self.create_user(
            first_name=first_name,
            last_name=last_name,
            email=email,
            birth_date=birth_date,
            cpf=cpf,
            phone=phone,
            password=password,
            **extra_fields
        )

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    birth_date = models.DateField()
    cpf = models.CharField(max_length=14, unique=True)
    phone = models.CharField(max_length=13)

    groups = models.ManyToManyField(
        PermissionGroup,
        related_name='customuser_groups',  # ✅ Evita conflito com UserPermission
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    
    inserted_by = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="inserted_users")
    inserted_in = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="modified_users")
    modified_in = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "birth_date", "cpf", "phone"]

    objects = CustomUserManager()

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=["email"], name="user_email_idx"),
            models.Index(fields=["cpf"], name="user_cpf_idx"),
        ]

    def __str__(self):
        groups = ", ".join(g.name for g in self.groups.all())
        return f"{self.first_name} {self.last_name} ({self.email}) - Groups: {groups or 'None'}"

class UserAvatar(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="avatar")
    image = models.ImageField(
        upload_to=avatar_upload_path,
        validators=[
            FileExtensionValidator(["jpg", "jpeg", "png", "gif"]),
            validate_image_size
        ],
        help_text="Avatar image (max 3MB)"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avatar of {self.user.email}"
