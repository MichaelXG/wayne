#!/bin/bash
export DJANGO_SETTINGS_MODULE=wayne_backend.settings

echo "✅ Starting entry script..."

DB_PATH="backend/db/db.sqlite3"
if [ -f "$DB_PATH" ]; then
  echo "🗑️ Removing SQLite DB..."
  rm "$DB_PATH"
fi

# echo "📦 Installing dependencies..."
# pip install --no-cache-dir --root-user-action=ignore -r /app/requirements.txt || exit 1

echo "📄 Making migrations..."
python3 manage.py makemigrations || exit 1

echo "⚙️ Applying migrations..."
python3 manage.py migrate --noinput || exit 1

echo "👤 Creating superuser if not exists..."
python3 manage.py shell <<EOF
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()
email = settings.DJANGO_SUPERUSER_EMAIL

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(
        first_name=settings.DJANGO_SUPERUSER_FIRST_NAME,
        last_name=settings.DJANGO_SUPERUSER_LAST_NAME,
        email=email,
        cpf=settings.DJANGO_SUPERUSER_CPF,
        birth_date=settings.DJANGO_SUPERUSER_BIRTH_DATE,
        phone=settings.DJANGO_SUPERUSER_PHONE,
        password=settings.DJANGO_SUPERUSER_PASSWORD,
    )
    print("✅ Superuser created!")
else:
    print("ℹ️ Superuser already exists.")
EOF

# echo "🗃️ Collecting static files..."
# python3 manage.py collectstatic --noinput || exit 1

echo "🔍 Running system checks..."
python3 manage.py check || exit 1

echo "🚀 Starting dev server..."
exec watchmedo auto-restart --recursive --pattern='*.py' -- python manage.py runserver 0.0.0.0:8000
