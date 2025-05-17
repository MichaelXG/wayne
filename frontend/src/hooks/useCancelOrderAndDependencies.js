import { useCallback, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from './useLocalStorage';

export default function useCancelOrderAndDependencies() {
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const token = userData?.authToken;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrderAndDependencies = useCallback(
    async (orderId) => {
      if (!orderId || !token) return;

      setLoading(true);
      setError(null);

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Cancel Order Payment
        const { data: paymentData } = await axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, { headers });
        const payments = Array.isArray(paymentData) ? paymentData : paymentData?.results || [];
        for (const p of payments) {
          if (!p.canceled) {
            await axios.patch(`${API_ROUTES.ORDERS_PAYMENT}${p.id}/`, { canceled: true }, { headers });
          }
        }

        // Cancel Shipping
        const { data: shippingData } = await axios.get(`${API_ROUTES.ORDERS_SHIPPING}?order=${orderId}`, { headers });
        const shippings = Array.isArray(shippingData) ? shippingData : shippingData?.results || [];
        for (const s of shippings) {
          if (!s.canceled) {
            await axios.patch(`${API_ROUTES.ORDERS_SHIPPING}${s.id}/`, { canceled: true }, { headers });
          }
        }

        // Cancel Delivery
        const { data: deliveryData } = await axios.get(`${API_ROUTES.ORDERS_DELIVERY}?order=${orderId}`, { headers });
        const deliveries = Array.isArray(deliveryData) ? deliveryData : deliveryData?.results || [];
        for (const d of deliveries) {
          if (!d.canceled) {
            await axios.patch(`${API_ROUTES.ORDERS_DELIVERY}${d.id}/`, { canceled: true }, { headers });
          }
        }

        // Cancel the Order itself
        await axios.patch(`${API_ROUTES.ORDERS}${orderId}/`, { status: 'canceled' }, { headers });
      } catch (err) {
        console.error('❌ Failed to cancel order and its dependencies:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { cancelOrderAndDependencies, loading, error };
}
