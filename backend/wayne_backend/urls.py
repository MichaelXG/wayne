from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

# Terceiros
from rest_framework_simplejwt.views import TokenVerifyView

# Apps locais
from health.views import health_check
from auth_service.views import validate_token
from orders.views import TotalEarningView

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🔐 Auth / Users
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('recover.urls')),
    path('api/', include('reset.urls')),
    path('validate-token/', validate_token, name='validate_token'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # 🛍️ Store / Products / Orders
    path('api/products/', include('products.urls')),
    path('api/', include('orders.urls')),

    path('api/store/', include('store.urls')),

    # 💳 Wallet / Pagamentos
    path('api/wallets/', include('wallet.urls')),

    # 📦 Carrier / Entrega
    path('api/carrier/', include('carrier.urls')),

    # 📍 Endereços
    path('api/address/', include('address.urls')),

    # ❤️ Health Check
    path('health/', health_check, name='health_check'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
