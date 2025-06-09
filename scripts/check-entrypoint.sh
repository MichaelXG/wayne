#!/bin/bash

set -e

echo "🔍 Verificando entrypoint.sh..."

# 1. Verifica se o arquivo existe
if [ ! -f "./backend/entrypoint.sh" ]; then
  echo "❌ ERRO: ./backend/entrypoint.sh não encontrado!"
  exit 1
fi
echo "✅ Arquivo encontrado: ./backend/entrypoint.sh"

# 2. Verifica se tem a shebang correta
if ! grep -q '^#!/bin/bash' ./backend/entrypoint.sh; then
  echo "❌ ERRO: entrypoint.sh não possui '#!/bin/bash' na primeira linha!"
  exit 1
fi
echo "✅ Shebang correta encontrada."

# 3. Verifica se o arquivo está em formato Unix
if file ./backend/entrypoint.sh | grep -q CRLF; then
  echo "⚠️ Arquivo possui quebras de linha do Windows (CRLF). Convertendo para UNIX..."
  dos2unix ./backend/entrypoint.sh
  echo "✅ Conversão realizada com sucesso!"
else
  echo "✅ Arquivo já está em formato UNIX."
fi

# 4. Verifica se tem permissão de execução
if [ ! -x ./backend/entrypoint.sh ]; then
  echo "⚠️ Arquivo não está executável. Ajustando permissão..."
  chmod +x ./backend/entrypoint.sh
  echo "✅ Permissão de execução ajustada."
else
  echo "✅ Arquivo já possui permissão de execução."
fi

# 5. Verifica erros de sintaxe
echo "🔍 Verificando sintaxe..."
bash -n ./backend/entrypoint.sh && echo "✅ Sintaxe válida."

echo "🎯 entrypoint.sh pronto para ser usado!"
