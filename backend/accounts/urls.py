from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomUserViewSet, CustomLoginView, UserAvatarViewSet

# Roteador para ViewSet
router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='user')
router.register(r'avatars', UserAvatarViewSet, basename='user-avatar')

urlpatterns = [
    # Login JWT
    path('login/', CustomLoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Inclui rotas automáticas do ViewSet (ex: /users/)
urlpatterns += router.urls
