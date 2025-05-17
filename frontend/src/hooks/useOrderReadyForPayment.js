// src/hooks/useOrderReadyForPayment.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from './useLocalStorage';

export default function useOrderReadyForPayment(orderId) {
  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken;

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOrderReady = async () => {
      if (!orderId || !token) return;

      try {
        const [orderRes, shippingRes, deliveryRes] = await Promise.all([
          axios.get(`${API_ROUTES.ORDERS}${orderId}/`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_ROUTES.ORDERS_SHIPPING}?order=${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_ROUTES.ORDERS_DELIVERY}?order=${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const order = orderRes.data;
        const shippings = Array.isArray(shippingRes.data) ? shippingRes.data : shippingRes.data?.results || [];
        const deliveries = Array.isArray(deliveryRes.data) ? deliveryRes.data : deliveryRes.data?.results || [];

        const hasItems = Array.isArray(order?.items) && order.items.length > 0;
        const hasShipping = shippings.length > 0;
        const hasDelivery = deliveries.length > 0;

        setReady(hasItems && hasShipping && hasDelivery);
      } catch (error) {
        console.error('❌ Failed to check order readiness for payment:', error);
        setReady(false);
      } finally {
        setLoading(false);
      }
    };

    checkOrderReady();
  }, [orderId, token]);

  return { ready, loading };
}
