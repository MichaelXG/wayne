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

def create_user(username, email, password, first_name, last_name, groups=None, is_staff=False, is_superuser=False):
    """Cria um usuário com os grupos especificados"""
    try:
        if User.objects.filter(username=username).exists():
            print(f"⚠️ Usuário '{username}' já existe.")
            return None

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
            is_superuser=is_superuser
        )

        if groups:
            for group in groups:
                user.groups.add(group)

        print(f"✅ Usuário '{username}' criado com sucesso!")
        return user

    except Exception as e:
        print(f"❌ Erro ao criar usuário '{username}': {str(e)}")
        return None

def main():
    """Cria os usuários usando grupos existentes"""
    with transaction.atomic():
        # Recupera os grupos existentes
        groups = {g.name: g for g in Group.objects.all()}

        users_to_create = [
            {
                'username': 'bruce_wayne',
                'email': 'bruce-wayne@wayne.com',
                'password': 'bruce123',
                'first_name': 'Bruce',
                'last_name': 'Wayne',
                'groups': [groups['Administrator'], groups['Secret']],
                'is_staff': True,
                'is_superuser': True
            },
            {
                'username': 'alfred_pennyworth',
                'email': 'alfred-pennyworth@wayne.com',
                'password': 'alfred123',
                'first_name': 'Alfred',
                'last_name': 'Pennyworth',
                'groups': [groups['Administrator'], groups['Secret']],
                'is_staff': True,
                'is_superuser': True
            },
            {
                'username': 'beryl_worthington',
                'email': 'beryl-worthington@wayne.com',
                'password': 'beryl123',
                'first_name': 'Beryl',
                'last_name': 'Worthington',
                'groups': [groups['Administrator']],
                'is_staff': True,
            },
            {
                'username': 'customer',
                'email': 'customer@wayne.com',
                'password': 'customer123',
                'first_name': 'Customer',
                'last_name': 'Wayne',
                'groups': [groups['Customer']],
                'is_staff': True,
            },
            {
                'username': 'garrett_evans',
                'email': 'garrett_evans@wayne.com',
                'password': 'security123',
                'first_name': 'Garrett',
                'last_name': 'Evans',
                'groups': [groups['Security']],
                'is_staff': True,
            },
            {
                'username': 'linda_park',
                'email': 'linda_park@wayne.com',
                'password': 'sales123',
                'first_name': 'Linda',
                'last_name': 'Park',
                'groups': [groups['Sales']],
                'is_staff': True,
            },
            {
                'username': 'terry_mcginnis',
                'email': 'terry_mcginnis@wayne.com',
                'password': 'intern123',
                'first_name': 'Terry',
                'last_name': 'McGinnis',
                'groups': [groups['Intern']],
                'is_staff': False,
            },
            {
                'username': 'harold_allnut',
                'email': 'harold_allnut@wayne.com',
                'password': 'support123',
                'first_name': 'Harold',
                'last_name': 'Allnut',
                'groups': [groups['Support']],
                'is_staff': True,
            },
            {
                'username': 'jack_ryder',
                'email': 'jack_ryder@wayne.com',
                'password': 'seller123',
                'first_name': 'Jack',
                'last_name': 'Ryder',
                'groups': [groups['Seller']],
                'is_staff': True,
            }
        ]

        for user_data in users_to_create:
            create_user(**user_data)

if __name__ == '__main__':
    print("🚀 Iniciando criação de usuários...")
    main()
    print("✨ Processo finalizado!")
