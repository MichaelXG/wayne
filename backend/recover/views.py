from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import smart_bytes
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from datetime import datetime
from wayne_backend.core.tokens import expiring_token_generator
import logging
from dotenv import load_dotenv
from utils import is_password_reset_limit_reached, increment_password_reset_attempts

load_dotenv()

logger = logging.getLogger(__name__)
User = get_user_model()
FRONTEND_URL = getattr(settings, 'FRONTEND_URL', "http://localhost:3000/wayne")


class PasswordResetView(APIView):
    """
    API endpoint for initiating password reset via email.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()

        if not email:
            return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if is_password_reset_limit_reached(email):
            logger.warning(f"Too many reset attempts for {email}")
            return Response(
                {"error": "Too many password reset attempts. Please wait 15 minutes and try again."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        try:
            user = User.objects.get(email=email)

            uidb64 = urlsafe_base64_encode(smart_bytes(user.pk))
            token = expiring_token_generator.make_token(user)
            timestamp = int(datetime.now().timestamp() * 1000)  # milissegundos

            reset_link = f"{FRONTEND_URL}/pages/reset/{uidb64}/{token}/{timestamp}/"

            # Render email
            subject = "Wayne Industries - Reset Your Password"
            html_message = render_to_string('recover/password_reset_email.html', {
                'reset_link': reset_link,
                'user': user,
                'company_name': "Wayne Industries",
                'current_year': datetime.now().year,
            })

            increment_password_reset_attempts(email)

            send_mail(
                subject=subject,
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )

            logger.info(f"Password reset email sent to {email}")
            return Response({'detail': 'Password reset email sent successfully.'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            logger.warning(f"Password reset attempted for unknown email: {email}")
            return Response({'detail': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.exception(f"Unexpected error during password reset for {email}: {str(e)}")
            return Response({'detail': 'An internal error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
