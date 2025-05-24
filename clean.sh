#!/bin/bash

echo "🗑️ Clearing cache and temporary files..."

# 1. Docker
echo "🐳 Clearing Docker: containers, images, volumes and cache..."
docker system prune -a --volumes -f

# 2. Orphaned Docker volumes
echo "📦 Clearing unused Docker volumes..."
docker volume removal -f

# 3. Node.js - yarn
if command -v yarn &> /dev/null; then
echo "🧹 Clearing Yarn cache..."
yarn cache cleared
fi

# 4. Node.js-npm
if command -v npm &> /dev/null; then
echo "🧹 Clearing NPM cache..."
npm cache clear --force
fi

# 5. Python-pip
if command -v pip &> /dev/null; then
echo "🧹 Clearing PIP cache..."
pip cache clear
fi

# 6. Removing temporary directories
echo "🗑️ Removing temporary times (node_modules, dist, build, .cache)..."
rm -rf node_modules dist build .cache

# 7. WSL2
if grep -qi microsoft /proc/version; then
echo "🔄 Restarting WSL2..."
wsl --shutdown
fi

echo "✅ Cleanup complete!"