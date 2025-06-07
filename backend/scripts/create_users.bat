@echo off
echo [33m🔄 Iniciando script de criação de usuários...[0m

:: Verifica se o ambiente virtual está ativado
if "%VIRTUAL_ENV%"=="" (
    echo [33m⚠️ Ambiente virtual não detectado. Tentando ativar...[0m
    
    :: Tenta ativar o ambiente virtual
    if exist "venv\Scripts\activate.bat" (
        call venv\Scripts\activate.bat
    ) else if exist "..\venv\Scripts\activate.bat" (
        call ..\venv\Scripts\activate.bat
    ) else (
        echo [31m❌ Ambiente virtual não encontrado. Por favor, crie um ambiente virtual primeiro.[0m
        exit /b 1
    )
)

:: Executa o script Python
echo [33m📝 Executando script Python...[0m
python scripts/create_users.py

echo [32m✨ Script finalizado![0m
pause 