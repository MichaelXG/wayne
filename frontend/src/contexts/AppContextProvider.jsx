
import React from 'react';
import { OrderIDProvider } from './OrderIDContext';
import { ProductIDProvider } from './ProductIDContext';
import { StoredOrderProvider } from './StoredOrderIDContext';
import { CscProvider } from './CscContext';
import { CarrierIDProvider } from './CarrierIDContext';
import { AddressIDProvider } from './AddressIDContext';
import { PermissionsProvider } from './PermissionsContext'; 

export default function AppContextProvider({ children }) {
  return (
    <PermissionsProvider>
      <OrderIDProvider>
        <StoredOrderProvider>
          <CscProvider>
            <CarrierIDProvider>
              <AddressIDProvider>
                <ProductIDProvider>{children}</ProductIDProvider>
              </AddressIDProvider>
            </CarrierIDProvider>
          </CscProvider>
        </StoredOrderProvider>
      </OrderIDProvider>
    </PermissionsProvider>
  );
}
