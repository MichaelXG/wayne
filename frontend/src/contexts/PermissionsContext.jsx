import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from '../hooks/useLocalStorage';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [userData] = useLocalStorage('wayne-user-data', {});

  const loadPermissions = useCallback(async (token) => {
    if (!token) {
      console.warn('❗ Token not provided for loading permissions');
      setPermissions([]);
      return;
    }

    try {
      const response = await axios.get(API_ROUTES.MY_PERMISSIONS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPermissions(response.data.permissions || []);
    } catch (error) {
      console.error('❌ Error loading permissions:', error);
      setPermissions([]);
    }
  }, []);

  // Auto-load permissions when authToken changes
  useEffect(() => {
    if (userData?.authToken) {
      loadPermissions(userData.authToken);
    }
  }, [userData?.authToken, loadPermissions]);

  return (
    <PermissionsContext.Provider value={{ permissions, loadPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
