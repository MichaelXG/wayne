import logging
import random

from django.conf import settings
from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.response import Response
from twilio.rest import Client

from .models import Wallet
from .serializers import WalletSerializer

logger = logging.getLogger(__name__)


class MixedPermission(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or (request.user and request.user.is_staff)

    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS or (request.user and request.user.is_staff)


class WalletViewSet(viewsets.ModelViewSet):
    serializer_class = WalletSerializer
    permission_classes = [MixedPermission]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        user = self.request.user
        return Wallet.objects.filter(user=user) if user.is_authenticated else Wallet.objects.none()

    def perform_create(self, serializer):
        wallet = serializer.save(user=self.request.user)
        self._enforce_single_primary(wallet)

    def perform_update(self, serializer):
        wallet = serializer.save()
        self._enforce_single_primary(wallet)

    def _enforce_single_primary(self, wallet):
        if wallet.is_primary:
            Wallet.objects.filter(user=wallet.user).exclude(id=wallet.id).update(is_primary=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.orderPayments.exists():
            instance.status = 'canceled'
            instance.save()
            return Response({'detail': 'Card is in use and was marked as canceled.'}, status=status.HTTP_200_OK)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], url_path='send-csc-whatsapp')
    def send_csc_whatsapp(self, request, pk=None):
        try:
            wallet = self.get_object()
            user = wallet.user
            raw_phone = (user.phone or '').strip()

            logger.info(f"[CSC] Iniciando envio para usuário {user.id} (email: {user.email})")

            if not raw_phone:
                logger.warning(f"[CSC] ❌ Usuário {user.id} não possui número de telefone.")
                return Response({'error': 'Phone number not configured.'}, status=status.HTTP_400_BAD_REQUEST)

            # Normaliza número (assume +55 se não vier com +)
            phone_number = raw_phone if raw_phone.startswith('+') else f'+55{raw_phone}'
            logger.info(f"[CSC] Número formatado: {phone_number}")

            # Gera CSC de 3 dígitos
            csc = str(random.randint(100, 999))
            cache_key = f'csc_wallet_{wallet.id}'
            cache.set(cache_key, csc, timeout=300)  # 5 minutos

            logger.info(f"[CSC] Gerado {csc} para carteira {wallet.id} (usuário: {user.email}) - telefone: {phone_number}")

            try:
                # Envia WhatsApp via Twilio
                client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                message = client.messages.create(
                    from_=settings.TWILIO_WHATSAPP_FROM,
                    to=f'whatsapp:{phone_number}',
                    body=f'Seu código de segurança é: {csc}'
                )
                logger.info(f"[CSC] ✅ WhatsApp enviado para {phone_number} | SID: {message.sid}")
            except Exception as twilio_error:
                logger.error(f"[CSC] ❌ Erro Twilio: {str(twilio_error)}")
                return Response({
                    'error': 'Failed to send WhatsApp message.',
                    'detail': str(twilio_error)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Retorno inclui o CSC para debug (remova em produção!)
            return Response({
                'message': 'CSC sent via WhatsApp successfully.',
                'csc': csc,
                'sid': message.sid
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(f"[CSC] ❌ Falha ao enviar CSC via WhatsApp para {user.email}")
            return Response({
                'error': 'Failed to send WhatsApp message.',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='verify-csc')
    def verify_csc(self, request, pk=None):
        wallet = self.get_object()
        csc_input = str(request.data.get('csc', '')).strip()
        cache_key = f'csc_wallet_{wallet.id}'
        cached_csc = cache.get(cache_key)

        if not cached_csc:
            return Response({'error': 'Code expired or not requested.'}, status=status.HTTP_400_BAD_REQUEST)

        if csc_input == str(cached_csc):
            cache.delete(cache_key)
            logger.info(f'CSC verificado com sucesso para carteira {wallet.id}')
            return Response({'message': 'CSC verified successfully.'}, status=status.HTTP_200_OK)

        logger.warning(f'CSC inválido para carteira {wallet.id} - informado: {csc_input}')
        return Response({'error': 'Invalid CSC code.'}, status=status.HTTP_400_BAD_REQUEST)
