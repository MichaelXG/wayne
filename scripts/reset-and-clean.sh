#!/bin/bash

# Abrir o wsl
# chmod +x scripts/reset-and-clean.sh
# ./scripts/reset-and-clean.sh


echo "🗑️ Clearing cache and temporary files..."

# 1. Docker - limpar containers, imagens, volumes e cache
echo "🐳 Clearing Docker: containers, images, volumes and cache..."
docker-compose down
docker container prune -f
docker image prune -a -f
docker volume prune -f
docker builder prune -a -f
docker network prune -f
docker system df

# 2. Node.js - yarn
if command -v yarn &> /dev/null; then
  echo "🧹 Clearing Yarn cache..."
  yarn cache clean
fi

# 3. Node.js - npm
if command -v npm &> /dev/null; then
  echo "🧹 Clearing NPM cache..."
  npm cache clean --force
fi

# 4. Python - pip
if command -v pip &> /dev/null; then
  echo "🧹 Clearing PIP cache..."
  pip cache purge
fi

# 5. Removing temporary directories
echo "🗑️ Removing temporary files (node_modules, dist, build, .cache)..."
rm -rf node_modules dist build .cache

# 6. WSL2 - se aplicável
if grep -qi microsoft /proc/version; then
  echo "🔄 Restarting WSL2..."
  wsl --shutdown
fi

# 7. Recriar containers com build forçado
echo "🟩 Recriando containers com build forçado..."
docker-compose up --build -d

echo "✅ Reset and cleanup complete!"
