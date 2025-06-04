import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';

import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from '../hooks/useLocalStorage';
import { isTokenValid } from '../utils/auth';
import { useI18n } from '../contexts/I18nContext';
import { isDebug } from '../App';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { locale } = useI18n();
  const permissionsFetchedRef = useRef(false);

  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;

  // ✅ Recuperar do sessionStorage no primeiro carregamento
  useEffect(() => {
    const stored = sessionStorage.getItem('wayne-permissions');
    if (stored) {
      setPermissions(JSON.parse(stored));
      permissionsFetchedRef.current = true;
    }
  }, []);

  // ✅ Verificação de permissão por menu + ação
  const hasPermission = (menu, action = 'can_read') => {
    const menuKey = (menu || '').toLowerCase();
    const perm = permissions.find((p) => p.menu_name.toLowerCase() === menuKey);
    const rawValue = perm?.permissions?.[action];
    const result = rawValue === true;

    if (isDebug) {
      const status = result ? '✅ ALLOWED' : '⛔️ DENIED';
      console.log(
        `%c[PERMISSION CHECK]`,
        'color: white; background-color: #1976d2; padding: 2px 4px; border-radius: 4px;',
        `Menu: "${menuKey}" | Action: "${action}" → ${status} | Raw: ${JSON.stringify(rawValue)}`
      );
    }

    return result;
  };

  // ✅ Carrega permissões via API (se token for válido)
  const loadPermissions = async (token) => {
    if (permissionsFetchedRef.current) return;

    const valid = await isTokenValid(token);
    if (!valid) {
      clearPermissions();
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
        message: locale.UI?.PERMISSIONS?.LOADED || 'Permissions loaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error(locale.LOG_MESSAGES?.ERROR_LOADING || 'Error loading permissions', error);
      clearPermissions();

      setSnackbar({
        open: true,
        message: locale.UI?.PERMISSIONS?.LOAD_ERROR || 'Error loading permissions',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    if (token) {
      loadPermissions(token);
    }
  }, [token]);

  const clearPermissions = () => {
    setPermissions([]);
    sessionStorage.removeItem('wayne-permissions');
    permissionsFetchedRef.current = false;
  };

  const reloadPermissions = () => {
    if (isDebug) {
      console.log('[🔁 RELOAD PERMISSIONS] Iniciando recarregamento das permissões...');
      console.log('[🔁 RELOAD PERMISSIONS] Token presente?', !!token);
    }

    permissionsFetchedRef.current = false;

    if (token) {
      loadPermissions(token);
    } else {
      if (isDebug) {
        console.warn('[❌ RELOAD PERMISSIONS] Token ausente. Não foi possível recarregar permissões.');
      }
    }
  };

  const logout = () => {
    setUserData({});
    clearPermissions();
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission, loadPermissions, reloadPermissions, logout }}>
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
