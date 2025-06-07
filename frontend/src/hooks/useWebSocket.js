import { useEffect, useRef, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const useWebSocket = (onMessage) => {
  const wsRef = useRef(null);
  const [userData] = useLocalStorage('wayne-user-data', {});

  const connect = useCallback(() => {
    if (!userData?.authToken) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8001'}/ws/permissions/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onMessage) {
        onMessage(data);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      // Tenta reconectar após 5 segundos
      setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error('🔌 WebSocket error:', error);
      ws.close();
    };

    wsRef.current = ws;
  }, [userData?.authToken, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return wsRef.current;
}

export default useWebSocket; 