import os
import sys
import django
from django.contrib.auth.models import Group

# Configurar o ambiente Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wayne_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

def create_groups():
    """Cria os grupos de usuários se não existirem"""
    groups = ['admin', 'manager', 'staff', 'customer']
    created_groups = {}
    
    for group_name in groups:
        group, created = Group.objects.get_or_create(name=group_name)
        created_groups[group_name] = group
        if created:
            print(f"✅ Grupo '{group_name}' criado com sucesso!")
        else:
            print(f"ℹ️ Grupo '{group_name}' já existe.")
    
    return created_groups

def create_user(username, email, password, first_name, last_name, groups=None, is_staff=False, is_superuser=False):
    """Cria um usuário com os grupos especificados"""
    try:
        # Verifica se o usuário já existe
        if User.objects.filter(username=username).exists():
            print(f"⚠️ Usuário '{username}' já existe.")
            return None
        
        # Cria o usuário
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        
        # Adiciona aos grupos
        if groups:
            for group in groups:
                user.groups.add(group)
        
        print(f"✅ Usuário '{username}' criado com sucesso!")
        return user
    
    except Exception as e:
        print(f"❌ Erro ao criar usuário '{username}': {str(e)}")
        return None

def main():
    """Função principal para criar usuários"""
    with transaction.atomic():
        # Cria os grupos
        groups = create_groups()
        
        # Lista de usuários para criar
        users_to_create = [
            {
                'username': 'admin',
                'email': 'admin@wayne.com',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'Wayne',
                'groups': [groups['admin']],
                'is_staff': True,
                'is_superuser': True
            },
            {
                'username': 'manager',
                'email': 'manager@wayne.com',
                'password': 'manager123',
                'first_name': 'Manager',
                'last_name': 'Wayne',
                'groups': [groups['manager']],
                'is_staff': True
            },
            {
                'username': 'staff',
                'email': 'staff@wayne.com',
                'password': 'staff123',
                'first_name': 'Staff',
                'last_name': 'Wayne',
                'groups': [groups['staff']],
                'is_staff': True
            },
            {
                'username': 'customer',
                'email': 'customer@wayne.com',
                'password': 'customer123',
                'first_name': 'Customer',
                'last_name': 'Wayne',
                'groups': [groups['customer']]
            }
        ]
        
        # Cria os usuários
        for user_data in users_to_create:
            create_user(**user_data)

if __name__ == '__main__':
    print("🚀 Iniciando criação de usuários...")
    main()
    print("✨ Processo finalizado!") 