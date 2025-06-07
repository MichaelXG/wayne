# Project Wayne - Backend API 🦇

Django REST Framework backend application providing a robust API for user management, authentication, and business operations.

## 🌟 Features

- 🔐 **Authentication & Authorization**
  - JWT token-based authentication
  - Role-based access control (RBAC)
  - Permission groups management
  - Password reset and recovery

- 👤 **User Management**
  - Custom user model
  - User profiles
  - Group memberships
  - Activity tracking

- 📦 **Core Modules**
  - Products (`/products`)
  - Orders (`/orders`)
  - Addresses (`/address`)
  - Carriers (`/carrier`)
  - Wallet (`/wallet`)
  - Store (`/store`)
  - Permissions (`/permissions`)

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Redis
- Virtual Environment

### Environment Setup

1. Create `.env` file in the backend directory:
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
AFTERSHIP_API_KEY=your-aftership-api-key
```

### 🐳 Docker Setup

1. Build and run with Docker:
```bash
docker-compose build django_wayne_app
docker-compose up django_wayne_app
```

2. Create superuser:
```bash
docker-compose exec django_wayne_app python manage.py createsuperuser
```

### 🛠️ Manual Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run development server:
```bash
python manage.py runserver
```

## 📁 Project Structure

```
backend/
├── accounts/           # User management
├── address/           # Address management
├── auth_service/      # Authentication service
├── carrier/          # Carrier integration
├── health/           # Health check endpoints
├── orders/           # Order management
├── permissions/      # Permission management
├── products/         # Product management
├── recover/          # Password recovery
├── reset/            # Password reset
├── store/            # Store management
├── wallet/           # Wallet functionality
├── wayne_backend/    # Core Django settings
├── static/           # Static files
├── media/           # User uploaded files
├── templates/       # Email templates
└── requirements.txt  # Python dependencies
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/token/` - Obtain JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/password-reset/` - Request password reset

### Users
- `GET /api/users/` - List users
- `GET /api/users/<id>/` - Get user details
- `PUT /api/users/<id>/` - Update user
- `DELETE /api/users/<id>/` - Delete user

### Permissions
- `GET /api/permissions/` - List permissions
- `POST /api/permissions/groups/` - Create permission group
- `GET /api/permissions/groups/<id>/` - Get group details
- `PUT /api/permissions/groups/<id>/` - Update group

### Products
- `GET /api/products/` - List products
- `POST /api/products/` - Create product
- `GET /api/products/<id>/` - Get product details
- `PUT /api/products/<id>/` - Update product
- `DELETE /api/products/<id>/` - Delete product

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create order
- `GET /api/orders/<id>/` - Get order details
- `PUT /api/orders/<id>/` - Update order status

## 💳 Payment Integration with AfterShip

### AfterShip Setup

1. **Create AfterShip Account**
   - Sign up at [AfterShip](https://www.aftership.com)
   - Get your API key from the dashboard
   - Add to your `.env` file:
```env
AFTERSHIP_API_KEY=your-api-key-here
```

2. **Configure Webhook**
   - Go to AfterShip Dashboard > Settings > Webhooks
   - Add webhook URL: `https://your-domain.com/api/orders/webhook/aftership/`
   - Select events: `payment.success`, `payment.failed`

### Payment Flow

1. **Create Payment**
```python
# Example API call
POST /api/orders/payment/create/
{
    "order_id": "123",
    "amount": 99.99,
    "currency": "USD",
    "customer_email": "customer@example.com"
}
```

2. **Handle Webhook**
   - AfterShip sends payment status to your webhook
   - Order status updates automatically
   - Payment details stored in order history

### Payment Status Tracking

- `GET /api/orders/<id>/payment/` - Get payment status
- `GET /api/orders/<id>/payment/history/` - Get payment history

### Error Handling

- Payment failures trigger email notifications
- Retry mechanism for failed payments
- Automatic refund processing for cancelled orders

## ⚙️ Configuration

### Key Settings (settings.py)

```python
# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": DATABASE_DIR / "db.sqlite3",
    }
}

# Redis Cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

# JWT Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

# Cors Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## 🔐 Security Features

1. **Data Encryption**
   - Sensitive fields encrypted using `FIELD_ENCRYPTION_KEY`
   - Passwords hashed using Django's password hasher

2. **Authentication**
   - JWT token-based authentication
   - Token refresh mechanism
   - Password reset with email verification

3. **Authorization**
   - Role-based access control
   - Permission groups
   - Object-level permissions

4. **API Security**
   - CORS protection
   - CSRF protection
   - Rate limiting
   - Request validation

## 🧪 Testing

Run tests with:
```bash
python manage.py test
```

For coverage report:
```bash
coverage run manage.py test
coverage report
```

## 📦 Dependencies

Key packages:
- Django==5.2
- djangorestframework==3.15.2
- django-cors-headers==4.7.0
- django-redis==5.4.0
- djangorestframework_simplejwt==5.5.0
- Pillow==11.1.0
- python-decouple==3.8
- redis==5.3.0

## 🔧 Development Tools

1. **Django Admin**
   - Access at: http://localhost:8000/admin/
   - Manage users, permissions, and data

2. **API Documentation**
   - Swagger UI: http://localhost:8000/api/swagger/
   - ReDoc: http://localhost:8000/api/redoc/

3. **Debug Toolbar**
   - Available in development mode
   - Monitor queries and performance

## 🚀 Deployment

1. Set environment variables:
```env
DEBUG=False
ENV=production
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Use gunicorn for production:
```bash
gunicorn wayne_backend.wsgi:application
```

## 📝 Logging

Logs are configured in `settings.py`:
- Error logs: `/logs/error.log`
- Info logs: `/logs/info.log`
- Debug logs: `/logs/debug.log`

## 🤝 Contributing

1. Follow PEP 8 style guide
2. Write tests for new features
3. Update documentation
4. Create descriptive commit messages

## 📄 License

This project is licensed under the MIT License. 