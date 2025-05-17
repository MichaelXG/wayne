from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def validate_token(request):
    """
    🔐 Validates a JWT access token and confirms the user exists.
    """
    token = request.data.get('token')

    if not token:
        return Response(
            {'valid': False, 'message': 'Token is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        access_token = AccessToken(token)
        user_id = access_token.get('user_id')  # padrão do simplejwt

        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response(
                {'valid': False, 'message': 'User not found.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response({
            'valid': True,
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'valid': False, 'message': 'Invalid or expired token.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
