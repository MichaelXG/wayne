# Project Wayne 🦇

A modern web application built with Django REST Framework and React, featuring user authentication, permissions management, and various business modules.

## 🌟 Features

- 🔐 **Advanced Authentication System**
  - JWT-based authentication
  - Password reset functionality
  - Email verification
  - Session management

- 👥 **User Management**
  - Custom user model
  - Role-based access control
  - Group permissions
  - User profiles

- 🛡️ **Security**
  - Encrypted sensitive data
  - CORS protection
  - Rate limiting
  - Secure password storage

- 🔄 **Core Modules**
  - Products management
  - Order processing
  - Address management
  - Carrier integration
  - Wallet functionality
  - Store management

## 📚 Documentation

### Backend (Django REST Framework)
Detailed backend documentation can be found in [backend/README.md](backend/README.md)

Key features:
- Django 5.2 with REST Framework
- JWT Authentication
- Role-based permissions
- Redis caching
- SQLite database
- Modular architecture
- API endpoints for all features
- Comprehensive security measures

### Frontend (React + Material-UI)
Detailed frontend documentation can be found in [frontend/README.md](frontend/README.md)

Key features:
- React 18.2 with Material-UI 6
- Vite for development
- Protected routes
- Permission guards
- Theme customization
- Modern component architecture
- Responsive design
- Performance optimizations

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.8+
- Node.js 18+
- Redis

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd project-wayne
```

2. Create environment files:

For backend (`backend/.env`):
```env
DEBUG=True
ENV=development
SECRET_KEY=your-secret-key
FIELD_ENCRYPTION_KEY=your-encryption-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
EMAIL_HOST_USER_B64=your-base64-encoded-email
EMAIL_HOST_PASSWORD_B64=your-base64-encoded-password
REDIS_PASSWORD=your-redis-password
```

For frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
VITE_APP_BASE_NAME=/
NODE_ENV=development
```

### 🐳 Docker Setup (Recommended)

1. Start all services:
```bash
docker-compose up --build
```

2. Create superuser:
```bash
docker-compose exec django_wayne_app python manage.py createsuperuser
```

3. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/docs/

### 🛠️ Manual Setup

See detailed instructions in:
- Backend setup: [backend/README.md](backend/README.md#manual-setup)
- Frontend setup: [frontend/README.md](frontend/README.md#installation)

## 🏗️ Project Structure

```
project-wayne/
├── backend/           # Django REST Framework backend
│   ├── README.md     # Backend documentation
│   ├── accounts/     # User management
│   ├── products/     # Product management
│   └── ...          # Other Django apps
├── frontend/         # React frontend
│   ├── README.md    # Frontend documentation
│   ├── src/         # Source code
│   └── public/      # Static assets
└── docker-compose.yml
```

## 🔧 Configuration

See detailed configuration guides in:
- Backend configuration: [backend/README.md](backend/README.md#configuration)
- Frontend configuration: [frontend/README.md](frontend/README.md#environment-variables)

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up --build -d
```

### Stop Services
```bash
docker-compose down
```

### Clean Docker Environment
```bash
# Stop and remove containers
docker-compose down

# Remove containers
docker container prune -f

# Remove images
docker image prune -a -f

# Remove volumes
docker volume prune -f

# Remove build cache
docker builder prune -a -f

# Remove networks
docker network prune -f

# Check space usage
docker system df
```

### Rebuild Services
```bash
docker-compose up --build
```

## 🔐 Security Best Practices

1. Use environment variables for sensitive data
2. Keep `DEBUG=False` in production
3. Regular dependency updates
4. Strong password policies
5. HTTPS in production
6. Proper CORS configuration
7. API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For detailed contribution guidelines, see:
- Backend contribution: [backend/README.md](backend/README.md#contributing)
- Frontend contribution: [frontend/README.md](frontend/README.md#contributing)

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Django REST Framework
- React
- Material-UI
- Redis
- Docker

# 1. Parar os containers
docker-compose down

# 2. Remover os containers
docker container prune -f

# 3. Remover as imagens
docker image prune -a -f

# 4. Remover volumes (inclui banco de dados, se estiver em volume)
docker volume prune -f

# 5. Remover cache de build
docker builder prune -a -f

# 6. (Opcional) Remover redes
docker network prune -f

# 7. Confirmar que tudo foi limpo
docker system df

# 8. Recriar
docker-compose up --build -d



 docker network prune
 docker system prune -a --volumes
 docker-compose down -v  # Remove todos os containers e volumes
 docker-compose up --build  # Reconstrói e inicia o projeto

fake.store.2025@gmail.com
fake.store.2025@project.full.stack



fake.store.2025@FS


docker-compose down
docker container prune -f
docker image prune -a -f
docker volume prune -f
docker builder prune -a -f
docker network prune -f
docker system df
docker-compose up --build -d



Última aula JS!

github: 
git clone https://github.com/thiagooshiro/js-classes


Consumir fakestore api

pagina da API: https://fakestoreapi.com/docs

Vocês devem construir uma aplicação para consumir a API da FakeStore simulando uma página de e-commerce. 
É responsabilidade da dupla estruturar todo html e css, bem como o script em js com as seguintes funcionalidades: 

1 - Ao entrar na página todos os produtos devem ser exibidos na tela.

2 - Implementar um filtro de produtos por nome - esse filtro deve filtrar por carácter de forma parcial e seu comportamento é instantâneo - enquanto você digita ele filtra pelos caracteres existentes.

3 - Implementar filtro de produtos por categoria

4 - Implementar filtro de produtos por preço - esse filtro deve ser "flexível" 
considerando que pode ser para valores acima do valor informado, abaixo do valor informado
ou igual ao valor informado.

Extras:

Criar formulário  e página de cadastro de novos usuários

Criar formulário e página de cadastro de novos produtos.
