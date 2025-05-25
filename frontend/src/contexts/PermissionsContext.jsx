import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from '../hooks/useLocalStorage';
import { isTokenValid } from '../utils/auth';
import { useI18n } from '../contexts/I18nContext';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});

  const { locale } = useI18n();

  const loadPermissions = useCallback(
    async (token) => {
      if (!token) {
        console.warn(locale.LOG_MESSAGES.NO_TOKEN);
        setPermissions([]);
        return;
      }

      const valid = await isTokenValid(token);
      if (!valid) {
        console.warn(locale.LOG_MESSAGES.INVALID_TOKEN);
        setPermissions([]);
        setUserData({});
        return;
      }

      try {
        const response = await axios.get(API_ROUTES.MY_PERMISSIONS, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPermissions(response.data.permissions || []);
      } catch (error) {
        console.error(locale.LOG_MESSAGES.ERROR_LOADING, error);

        if (error.response?.status === 401) {
          console.warn(locale.LOG_MESSAGES.UNAUTHORIZED);
          setPermissions([]);
          setUserData({});
        } else {
          setPermissions([]);
        }
      }
    },
    [setUserData, locale]
  );

  // Auto-load permissions when authToken changes
  useEffect(() => {
    if (userData?.authToken) {
      loadPermissions(userData.authToken);
    }
  }, [userData?.authToken, loadPermissions]);

  return <PermissionsContext.Provider value={{ permissions, loadPermissions }}>{children}</PermissionsContext.Provider>;
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
