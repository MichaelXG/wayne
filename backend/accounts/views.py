import logging
from django.contrib.auth import authenticate, get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.shortcuts import get_object_or_404

from .models import CustomUser, UserAvatar
from .serializers import CustomUserSerializer, UserAvatarSerializer

logger = logging.getLogger(__name__)
User = get_user_model()


# 🔐 Utility: create JWT token pair for a user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permission() for permission in [AllowAny]]
        return [permission() for permission in [IsAdminUser]]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        tokens = get_tokens_for_user(user)
        logger.info(f"✅ User created: {user.email}")

        return Response({
            "user": serializer.data,
            **tokens
        }, status=status.HTTP_201_CREATED)


class CustomLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            logger.warning("⚠️ Login failed: missing email or password.")
            return Response({"detail": "Please provide both email and password."},
                            status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if not user:
            logger.warning(f"⚠️ Login failed for {email}: Invalid credentials.")
            return Response({"detail": "Invalid credentials. Please check your email and password."},
                            status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            logger.warning(f"⚠️ Login failed: User {email} is inactive.")
            return Response({"detail": "Your account is inactive. Please contact support."},
                            status=status.HTTP_403_FORBIDDEN)

        tokens = get_tokens_for_user(user)
        logger.info(f"✅ User {email} successfully authenticated.")

        return Response({
            **tokens,
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "birth_date": user.birth_date,
            "cpf": user.cpf,
            "phone": user.phone,
            "avatar": user.avatar.image.url if hasattr(user, 'avatar') and user.avatar.image else None
        }, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    pass


class UserAvatarViewSet(viewsets.ModelViewSet):
    queryset = UserAvatar.objects.all()
    serializer_class = UserAvatarSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['retrieve', 'list', 'get_my_avatar']:
            return [permission() for permission in [AllowAny]]
        return [permission() for permission in [IsAuthenticated]]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UserAvatar.objects.filter(user=self.request.user)
        return UserAvatar.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], url_path="me", permission_classes=[AllowAny])
    def get_my_avatar(self, request):
        user_id = request.query_params.get('id')
        email = request.query_params.get('email')

        if user_id:
            user = get_object_or_404(User, id=user_id)
        elif email:
            user = get_object_or_404(User, email=email)
        else:
            return Response({"detail": "Provide either 'id' or 'email'."},
                            status=status.HTTP_400_BAD_REQUEST)

        avatar = UserAvatar.objects.filter(user=user).first()
        if avatar:
            serializer = self.get_serializer(avatar)
            return Response(serializer.data)
        return Response({"detail": "No avatar found."}, status=status.HTTP_404_NOT_FOUND)
