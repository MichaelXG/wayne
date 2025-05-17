import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL
});

api.interceptors.request.use((config) => {
  const rawUserData = localStorage.getItem('fake-store-user-data');
  const parsed = rawUserData ? JSON.parse(rawUserData) : null;
  const token = parsed?.authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
