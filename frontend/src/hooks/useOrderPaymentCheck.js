import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from './useLocalStorage';

export default function useOrderPaymentCheck(orderId) {
  const [hasPayment, setHasPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData] = useLocalStorage('wayne-user-data', {});

  useEffect(() => {
    const fetchOrderPayment = async () => {
      if (!orderId || !userData?.authToken) return;
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, {
          headers: { Authorization: `Bearer ${userData.authToken}` }
        });

        const activePayment = (Array.isArray(data) ? data : data?.results)?.find((p) => !p.canceled);
        setHasPayment(!!activePayment);
        setError(null);
      } catch (err) {
        console.error('Failed to check payment status:', err);
        setError(err);
        setHasPayment(false);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderPayment();
  }, [orderId, userData?.authToken]);

  return { hasPayment, loading, error };
}
