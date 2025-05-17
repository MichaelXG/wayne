import { createContext, useContext, useState } from 'react';

const OrderIDContext = createContext();

export function OrderIDProvider({ children }) {
  const [orderId, setOrderId] = useState(null);

  return <OrderIDContext.Provider value={{ orderId, setOrderId }}>{children}</OrderIDContext.Provider>;
}

export function useOrderIDContext() {
  return useContext(OrderIDContext);
}

export default { OrderIDProvider, useOrderIDContext };
