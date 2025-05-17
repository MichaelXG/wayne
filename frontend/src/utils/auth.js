import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';

export async function isTokenValid(token) {
  if (!token) return false;

  try {
    // 🔍 Validação local (via exp do JWT)
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const now = Date.now() / 1000;

    if (!decodedPayload.exp || decodedPayload.exp <= now) {
      console.warn('[isTokenValid] Token expirado localmente.');
      return false;
    }

    // ✅ Se passou localmente, valida com backend
    const response = await axios.get(API_ROUTES.VALIDATE_TOKEN, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.status === 200;
  } catch (error) {
    console.warn('[isTokenValid] Erro ao validar token com backend:', error.response?.data || error.message);
    return false;
  }
}
