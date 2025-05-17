from django.apps import AppConfig


class WalletConfig(AppConfig):
    """
    Configuração do aplicativo Wallet responsável por gerenciar cartões salvos.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wallet'
    verbose_name = 'Wallet Management'
