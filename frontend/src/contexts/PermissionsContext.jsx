import { createContext, useContext, useState, useEffect, useRef } from 'react';
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

  // ✅ Recuperar permissões do sessionStorage na inicialização
  useEffect(() => {
    const stored = sessionStorage.getItem('wayne-permissions');
    if (stored) {
      setPermissions(JSON.parse(stored));
      permissionsFetchedRef.current = true;
    }
  }, []);

  const loadPermissions = async (token) => {
    if (!token) {
      setPermissions([]);
      sessionStorage.removeItem('wayne-permissions');
      permissionsFetchedRef.current = false;
      return;
    }

    if (permissionsFetchedRef.current) return;

    const valid = await isTokenValid(token);
    if (!valid) {
      setPermissions([]);
      sessionStorage.removeItem('wayne-permissions');
      permissionsFetchedRef.current = false;
      setUserData({});
      return;
    }

    try {
      const response = await axios.get(API_ROUTES.PERMISSIONS.MY, {
        headers: { Authorization: `Bearer ${token}` }
      });
      

      const perms = response.data.permissions || [];
      setPermissions(perms);
      sessionStorage.setItem('wayne-permissions', JSON.stringify(perms));
      permissionsFetchedRef.current = true;

      setSnackbar({
        open: true,
        message: locale.UI.PERMISSIONS.LOADED || 'Permissions loaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error(locale.LOG_MESSAGES.ERROR_LOADING, error);
      setPermissions([]);
      sessionStorage.removeItem('wayne-permissions');
      permissionsFetchedRef.current = false;

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

  const logout = () => {
    setUserData({});
    setPermissions([]);
    sessionStorage.removeItem('wayne-permissions');
    permissionsFetchedRef.current = false;
  };

  return (
    <PermissionsContext.Provider value={{ permissions, loadPermissions, logout }}>
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
