# Project Wayne - Frontend 🦇

Modern React application built with Material-UI, featuring a responsive dashboard, authentication system, and various business modules.

## 🌟 Features

- 🎨 **Modern UI/UX**
  - Material-UI v6 components
  - Responsive dashboard layout
  - Custom theme support
  - Dark/Light mode
  - Multiple font families

- 🔐 **Authentication**
  - JWT token management
  - Protected routes
  - Role-based access control
  - Permission guards

- 📱 **Core Features**
  - Products management
  - Orders processing
  - Carrier management
  - Address handling
  - User management
  - Permissions control

- 🛠️ **Developer Experience**
  - Vite for fast development
  - Hot Module Replacement
  - ESLint + Prettier
  - SASS support
  - Code splitting

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn package manager
- Backend API running

### Environment Setup

1. Create `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_BASE_NAME=/
NODE_ENV=development
```

### 🔧 Installation

1. Install dependencies:
```bash
yarn install
```

2. Start development server:
```bash
yarn dev
```

3. Build for production:
```bash
yarn build
```

4. Preview production build:
```bash
yarn preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   │   ├── ConfigContext.jsx       # Theme configuration
│   │   ├── PermissionsContext.jsx  # Access control
│   │   └── AppContextProvider.jsx  # Context wrapper
│   ├── hooks/          # Custom React hooks
│   ├── layout/         # Layout components
│   │   ├── MainLayout/   # Main app layout
│   │   └── MinimalLayout/# Auth pages layout
│   ├── routes/         # Route definitions
│   │   ├── MainRoutes.jsx    # Protected routes
│   │   └── AuthenticationRoutes.jsx
│   ├── services/       # API services
│   ├── ui-component/   # UI building blocks
│   └── views/          # Page components
│       ├── dashboard/
│       ├── products/
│       ├── orders/
│       └── users/
```

## 🔌 Key Dependencies

- **Core**
  - React 18.2
  - React Router DOM 7.4
  - Axios 1.8

- **UI Framework**
  - Material-UI 6.4
  - @emotion/react & styled
  - @tabler/icons-react
  - Framer Motion

- **Forms & Validation**
  - React Hook Form
  - Yup
  - React Input Mask

- **Data Display**
  - ApexCharts
  - MUI X-Data-Grid
  - React PDF Viewer

- **Development**
  - Vite 6.0
  - ESLint 9.16
  - Prettier 3.4
  - SASS

## 🔐 Authentication & Authorization

### Protected Routes
```jsx
<ProtectedRoute>
  <MainLayout>
    {/* Protected content */}
  </MainLayout>
</ProtectedRoute>
```

### Permission Guard
```jsx
<PermissionGuard menu="products" action="can_create">
  <CreateProductButton />
</PermissionGuard>
```

## 🎨 Theming

### Configuration
Theme settings are managed through `ConfigContext`:
```jsx
const { 
  fontFamily,
  borderRadius,
  onChangeFontFamily,
  onChangeBorderRadius 
} = useConfig();
```

### Custom Styling
```jsx
const useStyles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2)
  }
});
```

## 📡 API Integration

### Axios Setup
```jsx
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Data Fetching
```jsx
const { data, error } = useSWR('/api/products', fetcher);
```

## 🧪 Development Tools

### Code Quality
```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn prettier
```

### Build & Deploy
```bash
# Production build
yarn build

# Preview build
yarn preview
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8000 |
| VITE_APP_BASE_NAME | Base URL path | / |
| NODE_ENV | Environment mode | development |

## 🚀 Performance Optimization

1. **Code Splitting**
   - Route-based splitting
   - Lazy loading components
   ```jsx
   const ProductList = lazy(() => import('views/products/List'));
   ```

2. **Image Optimization**
   - Use appropriate formats
   - Implement lazy loading
   - Optimize for different screen sizes

3. **Caching Strategy**
   - SWR for data caching
   - Local storage for user preferences
   - Service worker for static assets

## 🐛 Debugging

1. Enable debug mode in `.env`:
```env
VITE_DEBUG=true
```

2. Use browser dev tools:
   - React Developer Tools
   - Redux DevTools (if implemented)
   - Network tab for API calls

## 🤝 Contributing

1. Follow the coding style guide
2. Write meaningful commit messages
3. Add proper documentation
4. Test your changes
5. Create a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI Team
- React Community
- Vite Team
- Open Source Contributors
