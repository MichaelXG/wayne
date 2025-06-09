import axios from 'axios';
import { API_BASE_URL } from '../routes/ApiRoutes';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const rawUserData = localStorage.getItem('wayne-user-data');
  const parsed = rawUserData ? JSON.parse(rawUserData) : null;
  const token = parsed?.authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
