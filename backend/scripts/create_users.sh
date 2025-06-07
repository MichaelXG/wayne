#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Iniciando script de criação de usuários...${NC}"

# Verifica se o ambiente virtual está ativado
if [ -z "$VIRTUAL_ENV" ]; then
    echo -e "${YELLOW}⚠️ Ambiente virtual não detectado. Tentando ativar...${NC}"
    
    # Tenta ativar o ambiente virtual
    if [ -d "venv" ]; then
        source venv/bin/activate
    elif [ -d "../venv" ]; then
        source ../venv/bin/activate
    else
        echo -e "${RED}❌ Ambiente virtual não encontrado. Por favor, crie um ambiente virtual primeiro.${NC}"
        exit 1
    fi
fi

# Executa o script Python
echo -e "${YELLOW}📝 Executando script Python...${NC}"
python scripts/create_users.py

echo -e "${GREEN}✨ Script finalizado!${NC}" 