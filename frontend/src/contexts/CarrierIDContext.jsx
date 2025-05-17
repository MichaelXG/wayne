import { createContext, useContext, useState } from 'react';

const CarrierIDContext = createContext();

export function CarrierIDProvider({ children }) {
  const [carrierId, setCarrierId] = useState(null);

  return <CarrierIDContext.Provider value={{ carrierId, setCarrierId }}>{children}</CarrierIDContext.Provider>;
}

export function useCarrierIDContext() {
  return useContext(CarrierIDContext);
}

export default {
  CarrierIDProvider,
  useCarrierIDContext
};
