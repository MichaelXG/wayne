import axios from 'axios';
import { authService } from './authService';
import { notify } from './notifier'; // ✅ usar notify global

function handleGlobalError(error) {
  const status = error.response?.status;

  if (!status) {
    notify('Network or unknown error.', 'error');
    return;
  }

  switch (status) {
    case 400:
      notify('Bad request.', 'warning');
      break;
    case 401:
      notify('Session expired. Please log in again.', 'error');
      authService.logout();
      break;
    case 403:
      notify('Access denied.', 'error');
      break;
    case 404:
      notify('Page not found.', 'warning');
      break;
    default:
      if (status >= 500) {
        notify('Server error. Please try again later.', 'error');
      } else {
        notify('An unexpected error occurred.', 'warning');
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
