from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import datetime, timedelta

# Optional: import logging
# import logging
# logger = logging.getLogger(__name__)

class ExpiringPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # Garante consistência do hash gerado para o usuário
        return f"{user.pk}{user.is_active}{timestamp}"

    def check_token(self, user, token, timestamp):
        """
        Checks if the token is valid and not expired.
        Expires after 30 minutes based on the passed timestamp (in milliseconds).
        """
        if not (user and token and timestamp):
            return False

        try:
            # Converte timestamp de milissegundos para segundos
            token_time = datetime.fromtimestamp(int(timestamp) / 1000)
            now = datetime.now()

            # Verifica expiração de 30 minutos
            if now - token_time > timedelta(minutes=30):
                # logger.warning("Token expired")
                return False

            # Primeiro valida estrutura do token
            if not super().check_token(user, token):
                return False

            return True

        except Exception as e:
            # logger.exception(f"Error validating token: {e}")
            return False


# Instância exportável
expiring_token_generator = ExpiringPasswordResetTokenGenerator()
