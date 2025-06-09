import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { API_ROUTES } from '../routes/ApiRoutes';
import axios from 'axios';
import { usePermissions } from '../contexts/PermissionsContext';

export default function ProtectedRoute({ requiredMenu, requiredAction = 'can_read' }) {
  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { permissions, reloadPermissions } = usePermissions();

  useEffect(() => {
    const validateToken = async () => {
      console.log('🔍 Starting token validation...');

      if (!userData.authToken) {
        console.warn('❌ No token found. Redirecting to login...');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(API_ROUTES.VALIDATE_TOKEN, {
          token: userData.authToken
        });

        if (response.status === 200) {
          console.log('✅ Token is valid. Access granted.');
          
          // If we have a valid token but no permissions, try to reload them
          if (permissions.length === 0) {
            console.log('🔄 No permissions found. Attempting to reload...');
            await reloadPermissions();
          }
          
          setIsAuthenticated(true);
        } else {
          console.warn('❌ Invalid token. Redirecting...');
          setUserData({});
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Error validating token:', error.response?.data || error);
        setUserData({});
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    validateToken();
  }, [userData, setUserData, permissions.length, reloadPermissions]);

  if (isLoading) {
    return <div>🔄 Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/pages/login" replace />;
  }

  // ✅ Check if the user has the required permission
  if (requiredMenu) {
    const perm = permissions.find(p => p.menu_name.toLowerCase() === requiredMenu.toLowerCase());
    if (!perm || !perm.permissions?.[requiredAction]) {
      console.warn(`🚫 No permission: ${requiredMenu} - ${requiredAction}`);
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <Outlet />;
}
