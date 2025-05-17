from django.urls import path
from .views import PasswordResetConfirmView

urlpatterns = [
    path('auth/reset-password/<uidb64>/<token>/<timestamp>', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

]
