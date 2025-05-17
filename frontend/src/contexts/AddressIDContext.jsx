import { createContext, useContext, useState } from 'react';

const AddressIDContext = createContext();

export function AddressIDProvider({ children }) {
  const [addressId, setAddressId] = useState(null);

  return <AddressIDContext.Provider value={{ addressId, setAddressId }}>{children}</AddressIDContext.Provider>;
}

export function useAddressIDContext() {
  return useContext(AddressIDContext);
}

export default {
  AddressIDProvider,
  useAddressIDContext
};
