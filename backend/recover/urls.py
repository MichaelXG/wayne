from django.urls import path
from .views import PasswordResetView

urlpatterns = [
    # 🔐 Endpoint público para envio de e-mail com link de redefinição de senha
    path('auth/recover-password/', PasswordResetView.as_view(), name='password_reset_request'),
]
