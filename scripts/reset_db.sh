#!/bin/bash

# 🧪 Como usar:
# Salve como reset_db.sh;
# Torne executável: chmod +x /script/reset_db.sh;
# Rode com: ./script/reset_db.sh

# ⚙️ Configurações
DB_ENGINE="sqlite"   # sqlite | postgres | mysql
DB_NAME="db.sqlite3"
DB_CONTAINER="wayne_db"     # Nome do container do banco (se usar Docker)
DB_USER="postgres"
DB_PASSWORD="postgres"

echo "🧹 Limpando migrations..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

if [ "$DB_ENGINE" == "sqlite" ]; then
  echo "🗑️  Removendo banco SQLite: $DB_NAME"
  rm -f "$DB_NAME"

elif [ "$DB_ENGINE" == "postgres" ]; then
  echo "🗑️  Resetando banco PostgreSQL no container $DB_CONTAINER"
  docker exec -i $DB_CONTAINER psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
  docker exec -i $DB_CONTAINER psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

elif [ "$DB_ENGINE" == "mysql" ]; then
  echo "🗑️  Resetando banco MySQL no container $DB_CONTAINER"
  docker exec -i $DB_CONTAINER mysql -u$DB_USER -p$DB_PASSWORD -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"

else
  echo "❌ DB_ENGINE inválido: $DB_ENGINE"
  exit 1
fi

echo "✅ Banco de dados limpo e migrado com sucesso!"
