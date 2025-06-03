#!/bin/bash
# ✅ Como usar:
# Dê permissão:
#   chmod +x scripts/clean-project.sh
#   ./scripts/clean-project.sh

echo "🚀 Iniciando limpeza de dependências e arquivos temporários..."

# Node.js - verificar e limpar dependências não usadas
if [ -f "package.json" ]; then
  if command -v depcheck &> /dev/null; then
    echo "🧹 Verificando dependências Node.js não usadas..."
    depcheck
  else
    echo "⚠️ depcheck não encontrado. Instale com: npm install -g depcheck"
  fi
  echo "🗑️ Removendo node_modules e lockfiles..."
  rm -rf node_modules package-lock.json yarn.lock
  echo "📦 Reinstalando dependências Node.js..."
  if [ -f "yarn.lock" ]; then
    yarn install
  else
    npm install
  fi
fi

# Python - gerar novo requirements.txt com apenas dependências usadas
if [ -f "requirements.txt" ]; then
  if command -v pipreqs &> /dev/null; then
    echo "🧹 Gerando novo requirements.txt..."
    pipreqs . --force --encoding=utf-8
  else
    echo "⚠️ pipreqs não encontrado. Instale com: pip install pipreqs"
  fi
fi

# Remover pastas temporárias
echo "🗑️ Removendo pastas temporárias (dist, build, .cache)..."
rm -rf dist build .cache

echo "✅ Limpeza concluída com sucesso!"
