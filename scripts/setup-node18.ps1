Write-Output "🚀 Verificando se o NVM está instalado..."
if (-Not (Get-Command "nvm.exe" -ErrorAction SilentlyContinue)) {
    Write-Output "❌ NVM não encontrado! Por favor, instale manualmente do link:"
    Write-Output "👉 https://github.com/coreybutler/nvm-windows/releases"
    exit 1
} else {
    Write-Output "✅ NVM encontrado!"
}

Write-Output "🚀 Instalando Node.js versão 18..."
nvm install 18

Write-Output "🚀 Definindo Node.js 18 como versão padrão..."
nvm use 18
nvm alias default 18

$nodeVersion = node -v
$npmVersion = npm -v

Write-Output "✅ Node.js versão atual: $nodeVersion"
Write-Output "✅ NPM versão atual: $npmVersion"

Write-Output "🎉 Configuração concluída com sucesso!"
