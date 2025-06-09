import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from './useLocalStorage';

export default function useOrderLockStatus(orderId) {
  const [hasPayment, setHasPayment] = useState(false);
  const [hasShipping, setHasShipping] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [canceledPayment, setCanceledPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData] = useLocalStorage('wayne-user-data', {});

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!orderId || !userData?.authToken) return;

      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${userData.authToken}` };

        const [orderRes, paymentRes, shippingRes, deliveryRes] = await Promise.all([
          axios.get(`${API_ROUTES.ORDERS}${orderId}/`, { headers }),
          axios.get(`${API_ROUTES.ORDERS_PAYMENT}?order=${orderId}`, { headers }),
          axios.get(`${API_ROUTES.ORDERS_SHIPPING}?order=${orderId}`, { headers }),
          axios.get(`${API_ROUTES.ORDERS_DELIVERY}?order=${orderId}`, { headers })
        ]);

        const order = orderRes.data;
        const payments = Array.isArray(paymentRes.data) ? paymentRes.data : paymentRes.data?.results || [];
        const shippings = Array.isArray(shippingRes.data) ? shippingRes.data : shippingRes.data?.results || [];
        const deliveries = Array.isArray(deliveryRes.data) ? deliveryRes.data : deliveryRes.data?.results || [];

        const activePayment = payments.find((p) => !p.canceled);
        const lastCanceled = [...payments].reverse().find((p) => p.canceled);

        setIsCanceled(order?.status === 'canceled');
        setIsCompleted(order?.status === 'completed');
        setHasPayment(!!activePayment);
        setHasShipping(shippings.some((s) => !s.canceled));
        setHasDelivery(deliveries.some((d) => !d.canceled));
        setCanceledPayment(lastCanceled || null);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to check order lock status:', err);
        setError(err);
        setIsCanceled(false);
        setIsCompleted(false);
        setHasPayment(false);
        setHasShipping(false);
        setHasDelivery(false);
        setCanceledPayment(null);
      } finally {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, [orderId, userData?.authToken]);

  const canEdit = !isCanceled && !hasPayment;
  const canPay = !isCanceled && !hasPayment;

  return {
    hasPayment,
    hasShipping,
    hasDelivery,
    isCanceled,
    isCompleted,
    canceledPayment,
    canEdit,
    canPay,
    loading,
    error
  };
}
