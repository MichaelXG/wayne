import { createContext, useContext, useEffect, useState } from 'react';

const StoredOrderIDContext = createContext();

export function StoredOrderProvider({ children }) {
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(null);

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem('order');
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrderItems(parsed.items || []);
      setOrderId(parsed.id || null);
    }
  }, []);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    if (orderItems.length > 0 && orderId) {
      localStorage.setItem('order', JSON.stringify({ id: orderId, items: orderItems }));
    }
  }, [orderItems, orderId]);

  const generateOrderId = () => {
    let counter = parseInt(localStorage.getItem('orderCounter') || '1', 10);
    const newId = String(counter).padStart(4, '0');
    localStorage.setItem('orderCounter', (counter + 1).toString());
    return newId;
  };

  const addToOrder = (product, quantity = 1) => {
    if (!orderId) {
      const newId = generateOrderId();
      setOrderId(newId); // ✅ define antes de atualizar os itens
    }

    setOrderItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      return existing
        ? prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
        : [...prev, { ...product, quantity }];
    });
  };

  const removeFromOrder = (productId) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setOrderId(null);
    localStorage.removeItem('order');
  };

  return (
    <StoredOrderIDContext.Provider value={{ orderId, orderItems, addToOrder, removeFromOrder, clearOrder }}>
      {children}
    </StoredOrderIDContext.Provider>
  );
}

export const useOrder = () => useContext(StoredOrderIDContext);
