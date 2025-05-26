import axios from 'axios';
import { authService } from './authService';
import { enqueueSnackbar } from 'notistack'; // ✅ Usando notistack

function handleGlobalError(error) {
  const status = error.response?.status;

  if (!status) {
    console.error('❌ Network/Unknown Error:', error);
    enqueueSnackbar('Network or unknown error.', { variant: 'error' });
    return;
  }

  switch (status) {
    case 400:
      console.warn('⚠️ Bad Request:', error.response.data);
      enqueueSnackbar('Bad request.', { variant: 'warning' });
      break;

    case 401:
      console.warn('🔒 Unauthorized');
      enqueueSnackbar('Session expired. Please log in again.', { variant: 'error' });
      authService.logout(); // ✅ Faz logout e redireciona
      break;

    case 403:
      console.warn('🚫 Access Denied');
      enqueueSnackbar('Access denied.', { variant: 'error' });
      break;

    case 404:
      console.warn('❓ Not Found');
      enqueueSnackbar('Page not found.', { variant: 'warning' });
      break;

    default:
      if (status >= 500) {
        console.error('💥 Server Error:', status, error.response.data);
        enqueueSnackbar('Server error. Please try again later.', { variant: 'error' });
      } else {
        console.warn(`⚠️ Unhandled error ${status}:`, error.response.data);
        enqueueSnackbar('An unexpected error occurred.', { variant: 'warning' });
      }
  }
}

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    handleGlobalError(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
