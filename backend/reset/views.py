from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from wayne_backend.core.tokens import expiring_token_generator
import logging
import re

logger = logging.getLogger(__name__)
User = get_user_model()


class PasswordResetConfirmView(APIView):
    """
    Confirms password reset using UID, token, and timestamp.
    Updates the password if all data is valid.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token, timestamp):
        password = request.data.get("password", "").strip()

        # ✅ Validate presence of required fields
        if not all([uidb64, token, timestamp, password]):
            return Response(
                {"error": "All fields (uidb64, token, password, timestamp) are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Convert timestamp from URL
        try:
            timestamp = int(timestamp)
        except ValueError:
            return Response(
                {"error": "Invalid timestamp format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Validate password strength
        password_regex = re.compile(
            r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$'
        )
        if not password_regex.match(password):
            return Response(
                {"error": "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Decode UID and get user
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            logger.warning(f"Invalid user or uid: {uidb64}")
            return Response(
                {"error": "Invalid user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Check token validity
        if not expiring_token_generator.check_token(user, token, timestamp):
            logger.warning(f"Invalid or expired token for user {user.email}")
            return Response(
                {"error": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ Set new password
        try:
            user.set_password(password)
            user.save()
            logger.info(f"Password reset successfully for {user.email}")
            return Response(
                {"message": "Password has been reset successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.error(f"Failed to save new password: {e}")
            return Response(
                {"error": "An error occurred while updating the password."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
