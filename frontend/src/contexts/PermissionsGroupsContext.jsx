import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from '../hooks/useLocalStorage';
import { isTokenValid } from '../utils/auth';
import { useI18n } from './I18nContext';
import { Snackbar, Alert } from '@mui/material';

const PermissionsGroupsContext = createContext();

export const PermissionsGroupsProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useLocalStorage('wayne-user-data', {});
  const { locale } = useI18n();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const loadGroups = async (token) => {
    if (!token) {
      resetState();
      return;
    }

    const valid = await isTokenValid(token);
    if (!valid) {
      resetState();
      setUserData({});
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(API_ROUTES.PERMISSIONS.GROUPS, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      setGroups(data);

      setSnackbar({
        open: true,
        message: locale?.UI?.PERMISSIONS?.LOADED || 'Permission groups loaded successfully.',
        severity: 'success'
      });
    } catch (error) {
      console.error(locale?.LOG_MESSAGES?.ERROR_LOADING || 'Error loading permissions groups:', error);
      resetState();

      setSnackbar({
        open: true,
        message: locale?.UI?.PERMISSIONS?.LOAD_ERROR || 'Error loading permission groups.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setGroups([]);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const logout = () => {
    setUserData({});
    resetState();
  };

  return (
    <PermissionsGroupsContext.Provider value={{ groups, setGroups, loadGroups, logout, loading }}>
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
    </PermissionsGroupsContext.Provider>
  );
};

export const usePermissionsGroups = () => {
  const context = useContext(PermissionsGroupsContext);
  if (!context) {
    throw new Error('usePermissionsGroups must be used within a PermissionsGroupsProvider');
  }
  return context;
};
