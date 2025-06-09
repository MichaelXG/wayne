
# 📌 Como usar:
# Salve como setup_venv_and_migrate.sh
# Torne executável:  chmod +x scripts/setup_venv_and_migrate.sh
# Execute o script: ./scripts/setup_venv_and_migrate.sh

#!/bin/bash

VENV_DIR="venv"

log_info() {
  echo -e "\033[1;34m[INFO]\033[0m $1"
}

log_error() {
  echo -e "\033[1;31m[ERROR]\033[0m $1"
}

log_info "📁 Entrando na pasta backend..."
cd backend || { log_error "Pasta 'backend' não encontrada."; exit 1; }

log_info "🐍 Criando ambiente virtual em ./${VENV_DIR} ..."
python3 -m venv $VENV_DIR

log_info "✅ Ambiente virtual criado."

log_info "⚙️ Ativando o ambiente virtual..."
source $VENV_DIR/bin/activate

log_info "📦 Instalando dependências do requirements.txt ..."
pip install --upgrade pip
pip install -r requirements.txt

log_info "🛠️ Executando makemigrations..."
python manage.py makemigrations

log_info "📦 Aplicando migrate..."
python manage.py migrate

log_info "🔐 Carregando variáveis do superusuário a partir do Django settings..."
DJANGO_SUPERUSER_FIRST_NAME=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_FIRST_NAME)")
DJANGO_SUPERUSER_LAST_NAME=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_LAST_NAME)")
DJANGO_SUPERUSER_CPF=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_CPF)")
DJANGO_SUPERUSER_BIRTH_DATE=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_BIRTH_DATE)")
DJANGO_SUPERUSER_EMAIL=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_EMAIL)")
DJANGO_SUPERUSER_PASSWORD=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_PASSWORD)")
DJANGO_SUPERUSER_PHONE=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_PHONE)")

if [[ -z "$DJANGO_SUPERUSER_FIRST_NAME" || -z "$DJANGO_SUPERUSER_LAST_NAME" || -z "$DJANGO_SUPERUSER_EMAIL" || -z "$DJANGO_SUPERUSER_CPF" || -z "$DJANGO_SUPERUSER_BIRTH_DATE" || -z "$DJANGO_SUPERUSER_PHONE" ]]; then
    log_error "Uma ou mais variáveis do superusuário estão ausentes!"
    exit 1
fi

log_info "👤 Criando superusuário se ainda não existir..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
email = "$DJANGO_SUPERUSER_EMAIL"
if not User.objects.filter(email=email).exists():
    try:
        User.objects.create_superuser(
            first_name="$DJANGO_SUPERUSER_FIRST_NAME",
            last_name="$DJANGO_SUPERUSER_LAST_NAME",
            email=email,
            cpf="$DJANGO_SUPERUSER_CPF",
            birth_date="$DJANGO_SUPERUSER_BIRTH_DATE",
            phone="$DJANGO_SUPERUSER_PHONE",
            password="$DJANGO_SUPERUSER_PASSWORD"
        )
        print("✅ Superusuário criado com sucesso!")
    except Exception as e:
        print(f"❌ Falha ao criar superusuário: {e}")
        import sys; sys.exit(1)
else:
    print("ℹ️ Superusuário já existe.")
EOF

log_info "🚀 Iniciando o servidor Django..."
python manage.py runserver 0.0.0.0:8000
