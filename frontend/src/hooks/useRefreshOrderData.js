import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';

export default function useRefreshOrderData({ orderId, token, userId, setWallet, setOrder, setLocked }) {
  const fetchWallet = useCallback(async () => {
    if (!userId) return;
    const { data } = await axios.get(API_ROUTES.WALLETS, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWallet(data);
  }, [userId, token, setWallet]);

  const fetchOrder = useCallback(async () => {
    const { data } = await axios.get(`${API_ROUTES.ORDERS}${orderId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrder(data);
  }, [orderId, token, setOrder]);

  const fetchOrderPayment = useCallback(async () => {
    const { data } = await axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const payment = (Array.isArray(data) ? data : data?.results)?.find((p) => !p.canceled);
    setLocked(!!payment);
  }, [orderId, token, setLocked]);

  const refreshDataInBackground = useCallback(async () => {
    try {
      await Promise.all([fetchWallet(), fetchOrder(), fetchOrderPayment()]);
    } catch (error) {
      console.error('❌ Error updating order data:', error);
    }
  }, [fetchWallet, fetchOrder, fetchOrderPayment]);

  return refreshDataInBackground;
}
