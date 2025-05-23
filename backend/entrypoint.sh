#!/bin/bash

# IMPORT DJANGO SETTINGS
export DJANGO_SETTINGS_MODULE=wayne_backend.settings

echo "✅ Starting entry script..."

FORCE_CLEAN=${FORCE_CLEAN:-false}

if [[ "$FORCE_CLEAN" == "true" ]]; then
    echo "🧹 Removing all Django migration files..."
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    find . -path "*/migrations/*.pyc" -delete

    echo "🗑️ Removing SQLite database file..."
    rm -f backend/db/db.sqlite3
    echo "✅ Cleanup complete!"
else
    echo "ℹ️ Skipping cleanup (set FORCE_CLEAN=true to force)."
fi

# Confirm Python and pip
echo "🛠️ Using python: $(which python3)"
echo "🐍 Python version: $(python3 --version)"

echo "⬆️ Ensuring pip is up-to-date..."
python3 -m pip install --upgrade pip --root-user-action=ignore || { echo "❌ Failed to upgrade pip!"; exit 1; }

# Install dependencies only if not installed
if ! python3 -c "import django" &>/dev/null; then
    echo "♻️ Installing Django..."
    pip install django --root-user-action=ignore || { echo "❌ Failed to install Django!"; exit 1; }
else
    echo "✅ Django already installed."
fi

echo "📦 Installing project dependencies..."
pip install --no-cache-dir --root-user-action=ignore -r /app/requirements.txt || { echo "❌ Failed to install dependencies!"; exit 1; }

sleep 1

# Migrations
echo "📄 Making migrations..."
python3 manage.py makemigrations || { echo "❌ Failed to generate migrations!"; exit 1; }

echo "⚙️ Applying migrations..."
python3 manage.py migrate --noinput || { echo "❌ Failed to apply migrations!"; exit 1; }

# Load superuser env
echo "🔍 Loading superuser variables from Django settings..."
DJANGO_SUPERUSER_FIRST_NAME=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_FIRST_NAME)")
DJANGO_SUPERUSER_LAST_NAME=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_LAST_NAME)")
DJANGO_SUPERUSER_CPF=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_CPF)")
DJANGO_SUPERUSER_BIRTH_DATE=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_BIRTH_DATE)")
DJANGO_SUPERUSER_EMAIL=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_EMAIL)")
DJANGO_SUPERUSER_PASSWORD=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_PASSWORD)")
DJANGO_SUPERUSER_PHONE=$(python3 -c "from django.conf import settings; print(settings.DJANGO_SUPERUSER_PHONE)")

if [[ -z "$DJANGO_SUPERUSER_FIRST_NAME" || -z "$DJANGO_SUPERUSER_LAST_NAME" || -z "$DJANGO_SUPERUSER_EMAIL" || -z "$DJANGO_SUPERUSER_CPF" || -z "$DJANGO_SUPERUSER_BIRTH_DATE" || -z "$DJANGO_SUPERUSER_PHONE" ]]; then
    echo "❌ ERROR: One or more superuser environment variables are missing!"
    exit 1
fi

# Create superuser
echo "👤 Creating superuser if it doesn't exist..."
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

# Import products
echo "📦 Importing products from local JSON..."
python3 manage.py import_products || { echo "❌ Failed to import products!"; exit 1; }

# Import carriers
echo "🚚 Importing carriers from AfterShip API..."
python3 manage.py import_carriers || { echo "❌ Failed to import carriers!"; exit 1; }
echo "✅ Carriers imported successfully!"

# Collect static
echo "🗃️ Collecting static files..."
python3 manage.py collectstatic --noinput || { echo "❌ Failed to collect static files!"; exit 1; }
echo "✅ Static files collected!"

# Check
echo "🔍 Running Django system checks..."
python3 manage.py check || { echo "❌ Django reported errors!"; exit 1; }
echo "✅ Django system checks passed!"

# Start Django with limited watchmedo
echo "🚀 Starting Django dev server with watchmedo..."
exec watchmedo auto-restart --recursive --pattern='*.py' --ignore-patterns='*/migrations/*.pyc' -- python manage.py runserver 0.0.0.0:8000
