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

# Remove volumes (inclui banco de dados, se estiver em volume)
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

## 👥 Test Users

The following users are available for testing purposes:

### Administrator Users
```
Username: bruce_wayne
Email: bruce-wayne@wayne.com
Password: bruce123
Role: Administrator, Secret
Full Name: Bruce Wayne
```

```
Username: alfred_pennyworth
Email: alfred-pennyworth@wayne.com
Password: alfred123
Role: Administrator, Secret
Full Name: Alfred Pennyworth
```

```
Username: beryl_worthington
Email: beryl-worthington@wayne.com
Password: beryl123
Role: Administrator
Full Name: Beryl Worthington
```

```
Username: terry_mcginnis
Email: terry_mcginnis@wayne.com
Password: intern123
Role: Administrator, Secret
Full Name: Terry McGinnis
```

### Security Staff
```
Username: garrett_evans
Email: garrett_evans@wayne.com
Password: security123
Role: Security
Full Name: Garrett Evans
```

### Sales Team
```
Username: linda_park
Email: linda_park@wayne.com
Password: sales123
Role: Sales
Full Name: Linda Park
```

### Support Team
```
Username: harold_allnut
Email: harold_allnut@wayne.com
Password: support123
Role: Support
Full Name: Harold Allnut
```

### Seller
```
Username: jack_ryder
Email: jack_ryder@wayne.com
Password: seller123
Role: Seller
Full Name: Jack Ryder
```

> ⚠️ **Note**: These are test accounts only. For production, always use strong passwords and remove test accounts.

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
