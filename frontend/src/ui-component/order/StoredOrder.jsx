import React, { useCallback, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

import { BaseDir, isDebug } from '../../App';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import StoredOrderPage from './StoredOrderPage';
import DefaultMinimalLayout from '../../layout/DefaultMinimalLayout';
import { getOrderFromLocalStorage } from '../../hooks/useLocalOrder';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../../routes/ApiRoutes';

export default function StoredOrder() {
  isDebug && console.log('📄 StoredOrder renderizado');
  const navigate = useNavigate();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;

  const checkingAuth = useAuthGuard();
  const order = getOrderFromLocalStorage();

  const breadcrumbs = useMemo(() => {
    const orderDate = order?.created_at
      ? new Date(order.created_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      : new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

    return [
      { label: 'Order' },
      { label: `#${order?.id || '0000'}` },
      { label: orderDate },
      { label: order?.status || 'pending', type: 'status' }
    ];
  }, [order]);

  const actionbutton = useMemo(
    () => ({
      label: 'Place Order',
      icon: <AddIcon />,
      onClick: async () => {
        try {
          const storedOrder = JSON.parse(localStorage.getItem('order'));
          if (!storedOrder || !storedOrder.items?.length) {
            alert('No order to submit!');
            return;
          }

          const payload = {
            items: storedOrder.items.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price
            })),
            status: 'pending',
            discount: 0,
            shippingFee: 0,
            tax: 0
          };

          const response = await axios.post(API_ROUTES.ORDERS, payload, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          const data = response.data;

          localStorage.removeItem('order');
          navigate(`/orders/detail/${data.id}`);
        } catch (error) {
          console.error('❌ Error placing order:', error);
          alert('Error placing order. Try again.');
        }
      }
    }),
    [token, navigate]
  );

  if (checkingAuth) return null;

  return (
    <DefaultMinimalLayout
      mainCardTitle="Order's"
      subCardTitle="Details"
      breadcrumbs={breadcrumbs}
      actionbutton={actionbutton}
      checkingAuth={!checkingAuth}
    >
      <StoredOrderPage />
    </DefaultMinimalLayout>
  );
}
