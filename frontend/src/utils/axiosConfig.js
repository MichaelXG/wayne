import axios from 'axios';
import { BaseDir } from '../App';

// interceptor global
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 400:
          console.warn('⚠️ Bad Request:', error.response.data);
          break;
        case 401:
          console.warn('🔒 Unauthorized: redirecting to /pages/login');
          window.location.href = `${BaseDir}/pages/login`;
          break;
        case 403:
          console.warn('🚫 Access Denied: redirecting to /forbidden');
          window.location.href = `${BaseDir}/forbidden`;
          break;
        case 404:
          console.warn('❓ Not Found: redirecting to /not-found');
          window.location.href = `${BaseDir}/not-found`;
          break;
        default:
          if (status >= 500) {
            console.error('💥 Server Error:', status, error.response.data);
            window.location.href = `${BaseDir}/server-error`;
          } else {
            console.warn(`⚠️ Unhandled error ${status}:`, error.response.data);
          }
      }
    } else {
      console.error('❌ Network/Unknown Error:', error);
    }

    return Promise.reject(error);
  }
);

export default axios;
