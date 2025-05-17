// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { API_ROUTES } from '../routes/ApiRoutes';
import axios from 'axios';

export default function ProtectedRoute() {
  const [userData, setUserData] = useLocalStorage('fake-store-user-data', {});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      console.log('🔍 Iniciando validação do token...');

      if (!userData.authToken) {
        console.warn('❌ Nenhum token encontrado. Redirecionando para login...');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(API_ROUTES.VALIDATE_TOKEN, {
          token: userData.authToken
        });

        if (response.status === 200) {
          console.log('✅ Token válido. Acesso permitido.');
          setIsAuthenticated(true);
        } else {
          console.warn('❌ Token inválido. Redirecionando...');
          setUserData({});
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Erro ao validar token:', error.response?.data || error);
        setUserData({});
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    validateToken();
  }, [userData, setUserData]);

  if (isLoading) {
    return <div>🔄 Verificando autenticação...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/pages/login" replace />;
  }

  return <Outlet />;
}
