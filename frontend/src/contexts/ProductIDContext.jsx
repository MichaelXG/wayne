import { createContext, useContext, useState } from 'react';

const ProductIDContext = createContext();

export function ProductIDProvider({ children }) {
  const [productId, setProductId] = useState(null);

  return <ProductIDContext.Provider value={{ productId, setProductId }}>{children}</ProductIDContext.Provider>;
}

export function useProductIDContext() {
  return useContext(ProductIDContext);
}

export default {
  ProductIDProvider,
  useProductIDContext
};
