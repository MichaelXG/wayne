// hooks/useAuthGuard.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isDebug } from '../App';
import useLocalStorage from './useLocalStorage';
import { isTokenValid } from '../utils/auth';

export const useAuthGuard = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userData] = useLocalStorage('wayne-user-data', {}); // ✅ só leitura
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = userData?.authToken;

      if (token) {
        if (isDebug) console.log('[DEBUG] Iniciando verificação do token no useAuthGuard...');

        const validToken = await isTokenValid(token);

        if (!validToken) {
          if (isDebug) console.warn('[DEBUG] Token inválido. Redirecionando para /pages/login');
          navigate('/pages/login', { replace: true });
        } else {
          if (isDebug) console.log('[DEBUG] Token válido. Permissão concedida.');
          setCheckingAuth(false);
        }
      } else {
        if (isDebug) console.log('[DEBUG] Nenhum token encontrado. Redirecionando para /pages/login');
        navigate('/pages/login', { replace: true });
      }
    };

    checkToken();
  }, [userData, navigate]);

  return checkingAuth;
};
