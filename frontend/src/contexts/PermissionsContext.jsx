import { createContext, useContext, useState, useRef } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from '../hooks/useLocalStorage';
import { isTokenValid } from '../utils/auth';
import { useI18n } from '../contexts/I18nContext';
import { Snackbar, Alert } from '@mui/material';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const permissionsFetchedRef = useRef(false);
  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});

  const { locale } = useI18n();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadPermissions = async (token) => {
    if (!token) {
      setPermissions([]);
      permissionsFetchedRef.current = false;
      return;
    }

    if (permissionsFetchedRef.current) return;

    const valid = await isTokenValid(token);
    if (!valid) {
      console.warn(locale.LOG_MESSAGES.INVALID_TOKEN);
      setPermissions([]);
      permissionsFetchedRef.current = false;
      setUserData({});
      return;
    }

    try {
      const response = await axios.get(API_ROUTES.MY_PERMISSIONS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPermissions(response.data.permissions || []);
      permissionsFetchedRef.current = true;

      // ✅ Sucesso visual
      setSnackbar({
        open: true,
        message: locale.UI.PERMISSIONS.LOADED || 'Permissions loaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error(locale.LOG_MESSAGES.ERROR_LOADING, error);

      if (error.response?.status === 401) {
        console.warn(locale.LOG_MESSAGES.UNAUTHORIZED);
        setPermissions([]);
        permissionsFetchedRef.current = false;
        setUserData({});
      } else {
        setPermissions([]);
        permissionsFetchedRef.current = false;
      }

      // ✅ Erro visual
      setSnackbar({
        open: true,
        message: locale.UI.PERMISSIONS.LOAD_ERROR || 'Error loading permissions',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <PermissionsContext.Provider value={{ permissions, loadPermissions }}>
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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
