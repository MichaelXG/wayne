#!/bin/bash

set -euo pipefail  # ❗ Aborta em qualquer erro, variáveis indefinidas e falhas em pipelines

# Função de log com cores
log_info() { echo -e "\033[1;34mℹ️ $1\033[0m"; }
log_success() { echo -e "\033[1;32m✅ $1\033[0m"; }
log_warn() { echo -e "\033[1;33m⚠️ $1\033[0m"; }
log_error() { echo -e "\033[1;31m❌ $1\033[0m"; }

trap 'log_error "❌ Ocorreu um erro na execução do script!"' ERR

export DJANGO_SETTINGS_MODULE=wayne_backend.settings
log_info "Starting entry script..."

FORCE_CLEAN="${FORCE_CLEAN:-false}"

if [[ "$FORCE_CLEAN" == "true" ]]; then
    log_info "Removing all Django migration files..."
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find . -path "*/migrations/*.pyc" -delete

    log_info "Removing SQLite database file..."
    rm -f backend/db/db.sqlite3
    log_success "Cleanup complete!"
else
    log_info "Skipping cleanup (set FORCE_CLEAN=true to force)."
fi

log_info "Using python: $(which python3)"
log_info "Python version: $(python3 --version)"

log_info "Ensuring pip is up-to-date..."
python3 -m pip install --upgrade pip --root-user-action=ignore

log_info "Installing project dependencies..."
pip install --no-cache-dir --root-user-action=ignore -r /app/requirements.txt

sleep 1

generate_migration() {
    app="$1"
    log_info "Generating migrations for ${app}..."
    python3 manage.py makemigrations "$app"
}

apps=(accounts products orders wallet address carrier permissions)
for app in "${apps[@]}"; do
    generate_migration "$app"
done

log_info "Generating general migrations..."
python3 manage.py makemigrations

log_info "Applying migrations..."
python3 manage.py migrate --noinput

log_info "Loading superuser variables from Django settings..."
DJANGO_SUPERUSER_FIRST_NAME=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_FIRST_NAME)")
DJANGO_SUPERUSER_LAST_NAME=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_LAST_NAME)")
DJANGO_SUPERUSER_CPF=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_CPF)")
DJANGO_SUPERUSER_BIRTH_DATE=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_BIRTH_DATE)")
DJANGO_SUPERUSER_EMAIL=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_EMAIL)")
DJANGO_SUPERUSER_PASSWORD=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_PASSWORD)")
DJANGO_SUPERUSER_PHONE=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_PHONE)")

if [[ -z "$DJANGO_SUPERUSER_FIRST_NAME" || -z "$DJANGO_SUPERUSER_LAST_NAME" || -z "$DJANGO_SUPERUSER_EMAIL" || -z "$DJANGO_SUPERUSER_CPF" || -z "$DJANGO_SUPERUSER_BIRTH_DATE" || -z "$DJANGO_SUPERUSER_PHONE" ]]; then
    log_error "One or more superuser environment variables are missing!"
    exit 1
fi

log_info "Creating superuser if it doesn't exist..."
python3 manage.py shell <<EOF
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
        print("✅ Superuser created successfully!")
    except Exception as e:
        print(f"❌ Failed to create superuser: {e}")
        import sys
        sys.exit(1)
else:
    print("ℹ️ Superuser already exists.")
EOF

run_management_command() {
    cmd="$1"
    description="$2"
    log_info "$description..."
    python3 manage.py "$cmd"
}

run_management_command setup_permissions "Importing permissions"
run_management_command import_products "Importing products from local JSON"
run_management_command import_carriers "Importing carriers from AfterShip API"
log_success "All import tasks completed!"

log_info "Collecting static files..."
python3 manage.py collectstatic --noinput
log_success "Static files collected!"

log_info "Running Django system checks..."
python3 manage.py check
log_success "Django system checks passed!"

log_info "Starting Django dev server with watchmedo..."
exec watchmedo auto-restart --recursive --pattern='*.py' --ignore-patterns='*/migrations/*.pyc' -- python manage.py runserver 0.0.0.0:8000
log_success "Django dev server started successfully!"