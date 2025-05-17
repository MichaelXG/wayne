from pathlib import Path
from datetime import timedelta
from django.core.management.utils import get_random_secret_key

from decouple import config, Csv
import base64

def decode_base64(value):
    try:
        return base64.b64decode(value).decode("utf-8") if value else None
    except Exception:
        return None  # evita que erros de decodificação quebrem o Django
    
# Define o BASE_DIR dinamicamente baseado no ambiente
BASE_DIR = Path(__file__).resolve().parent.parent

# Definir a chave secreta do Django, gerando uma se não estiver no .env
SECRET_KEY = config("SECRET_KEY", default=get_random_secret_key())

FIELD_ENCRYPTION_KEY = config("FIELD_ENCRYPTION_KEY", get_random_secret_key())

AFTERSHIP_API_KEY = config("AFTERSHIP_API_KEY")

# Definir o modo DEBUG baseado no ambiente
DEBUG = config("DEBUG", default=False, cast=bool)

# Definir o ambiente (production ou development)
ENV = config("ENV", default="development")

# URL do frontend
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:3000")

# Configuração de Hosts permitidos
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())

# Configuração do Django CORS
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS", default="http://localhost:3000", cast=Csv())

# 🔥 Adicionando a configuração do ROOT_URLCONF (corrige erro!)
ROOT_URLCONF = "wayne_backend.urls"  # Ajuste conforme o nome correto do seu projeto

# Configuração dos arquivos estáticos
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"] if DEBUG else []

# Configuração dos arquivos de mídia
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Configuração do banco de dados (SQLite)
DATABASE_DIR = BASE_DIR / "db"

# 🔥 Melhorando a criação da pasta db/
if not DATABASE_DIR.exists():
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": DATABASE_DIR / "db.sqlite3",
    }
}

# Configuração de autenticação
AUTH_USER_MODEL = "accounts.CustomUser"
AUTHENTICATION_BACKENDS = ("django.contrib.auth.backends.ModelBackend",)

# Validação de senha
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internacionalização
LANGUAGE_CODE = "pt-br" if ENV == "development" else "en"
TIME_ZONE = "America/Sao_Paulo"
USE_TZ = True
USE_I18N = True
USE_L10N = True
USE_THOUSAND_SEPARATOR = True

# Configuração do Django Rest Framework e JWT
REST_FRAMEWORK = {
    # 🔐 Autenticação padrão: JWT
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    # 🔒 Permissão padrão: exige autenticação
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),

    # 🔍 Filtros (opcional, caso use django-filter)
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# Django Password Reset Token lifetime
PASSWORD_RESET_TIMEOUT = 60 * 30  # 30 minutes

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=35),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
}

# Configuração de e-mail
EMAIL_BACKEND = config("EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = config("EMAIL_HOST", default="smtp.gmail.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_HOST_USER = decode_base64(config("EMAIL_HOST_USER_B64", default=""))
EMAIL_HOST_PASSWORD = decode_base64(config("EMAIL_HOST_PASSWORD_B64", default=""))
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Configuração de cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

# Configuração do caminho para templates
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Configuração do middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Aplicações instaladas
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "accounts", 
    "recover",
    "reset",
    "store",
    "health",
    "auth_service",
    "products", 
    "orders",
    'address',
    'wallet',
    'carrier',
]

# Configuração da WSGI
WSGI_APPLICATION = "wayne_backend.wsgi.application"

# Configuração do idioma e localização
LANGUAGES = [
    ("en", "English"),
    ("pt", "Português"),
]

LOCALE_PATHS = [BASE_DIR / "locale"]

DATE_FORMAT = "d/m/Y"
TIME_FORMAT = "H:i"
DATETIME_FORMAT = "d/m/Y H:i"
DATE_INPUT_FORMATS = ["%d-%m-%Y", "%Y-%m-%d"]
TIME_INPUT_FORMATS = ["%H:%M", "%H:%M:%S"]
DECIMAL_SEPARATOR = ","
THOUSAND_SEPARATOR = "."

# Tipo de chave primária padrão
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

#  Superusuário do Django
DJANGO_SUPERUSER_FIRST_NAME = decode_base64(config("DJANGO_SUPERUSER_FIRST_NAME_B64"))
DJANGO_SUPERUSER_LAST_NAME  = decode_base64(config("DJANGO_SUPERUSER_LAST_NAME_B64"))
DJANGO_SUPERUSER_CPF        = decode_base64(config("DJANGO_SUPERUSER_CPF_B64"))
DJANGO_SUPERUSER_BIRTH_DATE = decode_base64(config("DJANGO_SUPERUSER_BIRTH_DATE_B64"))
DJANGO_SUPERUSER_EMAIL      = decode_base64(config("DJANGO_SUPERUSER_EMAIL_B64"))
DJANGO_SUPERUSER_PASSWORD   = decode_base64(config("DJANGO_SUPERUSER_PASSWORD_B64"))
DJANGO_SUPERUSER_PHONE      = decode_base64(config("DJANGO_SUPERUSER_PHONE_B64"))


# Suas credenciais da Twilio (coloque em variáveis de ambiente depois para segurança)
TWILIO_ACCOUNT_SID = 'AC0c3abb72c73a8139dfa82747b057eabd'
TWILIO_AUTH_TOKEN = '35b7e123ade9551e506a1dc58bb446c9'
TWILIO_WHATSAPP_FROM = 'whatsapp:+14155238886'  # fixo para sandbox

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',  # ou INFO se quiser menos verboso
    },
}
