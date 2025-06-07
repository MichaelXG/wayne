from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from permissions.models import PermissionGroup
from accounts.models import UserAvatar

User = get_user_model()

class Command(BaseCommand):
    help = 'Cria usuários iniciais do sistema'

    def create_user(self, username, email, password, first_name, last_name, birth_date, cpf, phone, avatar_data=None, groups=None, is_staff=False, is_superuser=False):
        """Cria um usuário com os grupos especificados"""
        try:
            if User.objects.filter(username=username).exists():
                self.stdout.write(self.style.WARNING(f"⚠️ Usuário '{username}' já existe."))
                return None

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                birth_date=birth_date,
                cpf=cpf,
                phone=phone,
                is_staff=is_staff,
                is_superuser=is_superuser
            )

            if groups:
                for group in groups:
                    user.groups.add(group)

            if avatar_data:
                UserAvatar.objects.create(
                    user=user,
                    image=avatar_data['image']
                )

            self.stdout.write(self.style.SUCCESS(f"✅ Usuário '{username}' criado com sucesso!"))
            return user

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Erro ao criar usuário '{username}': {str(e)}"))
            return None

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("🚀 Iniciando criação de usuários..."))
        
        with transaction.atomic():
            # Recupera os grupos existentes
            groups = {g.name: g for g in PermissionGroup.objects.all()}

            users_to_create = [
                {
                    'username': 'bruce_wayne',
                    'email': 'bruce-wayne@wayne.com',
                    'password': 'bruce123',
                    'first_name': 'Bruce',
                    'last_name': 'Wayne',
                    'birth_date': '1985-02-19',
                    'cpf': '12345678901',
                    'phone': '11999990001',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/bruce_wayne.png'
                    },
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
                    'birth_date': '1945-04-16',
                    'cpf': '23456789012',
                    'phone': '11999990002',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/alfred_pennyworth.png'
                    },
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
                    'birth_date': '1990-08-23',
                    'cpf': '34567890123',
                    'phone': '11999990003',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/beryl_worthington.png'
                    },
                    'groups': [groups['Administrator']],
                    'is_staff': True,
                },
                {
                    'username': 'garrett_evans',
                    'email': 'garrett_evans@wayne.com',
                    'password': 'security123',
                    'first_name': 'Garrett',
                    'last_name': 'Evans',
                    'birth_date': '1988-11-30',
                    'cpf': '45678901234',
                    'phone': '11999990004',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/garrett_evans.png'
                    },
                    'groups': [groups['Security']],
                    'is_staff': True,
                },
                {
                    'username': 'linda_park',
                    'email': 'linda_park@wayne.com',
                    'password': 'sales123',
                    'first_name': 'Linda',
                    'last_name': 'Park',
                    'birth_date': '1992-06-15',
                    'cpf': '56789012345',
                    'phone': '11999990005',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/linda_park.png'
                    },
                    'groups': [groups['Sales']],
                    'is_staff': True,
                },
                {
                    'username': 'terry_mcginnis',
                    'email': 'terry_mcginnis@wayne.com',
                    'password': 'intern123',
                    'first_name': 'Terry',
                    'last_name': 'McGinnis',
                    'birth_date': '1999-08-18',
                    'cpf': '67890123456',
                    'phone': '11999990006',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/terry_mcginnis.png'
                    },
                    'groups': [groups['Administrator'], groups['Secret']],
                    'is_staff': True,
                },
                {
                    'username': 'harold_allnut',
                    'email': 'harold_allnut@wayne.com',
                    'password': 'support123',
                    'first_name': 'Harold',
                    'last_name': 'Allnut',
                    'birth_date': '1970-03-25',
                    'cpf': '78901234567',
                    'phone': '11999990007',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/harold_allnut.png'
                    },
                    'groups': [groups['Support']],
                    'is_staff': True,
                },
                {
                    'username': 'jack_ryder',
                    'email': 'jack_ryder@wayne.com',
                    'password': 'seller123',
                    'first_name': 'Jack',
                    'last_name': 'Ryder',
                    'birth_date': '1987-12-10',
                    'cpf': '89012345678',
                    'phone': '11999990008',
                    'avatar_data': {
                        'image': 'https://github.com/MichaelXG/assets/raw/main/images/users/jack_ryder.png'
                    },
                    'groups': [groups['Seller']],
                    'is_staff': True,
                }
            ]

            for user_data in users_to_create:
                self.create_user(**user_data)

        self.stdout.write(self.style.SUCCESS("✨ Processo finalizado!"))
