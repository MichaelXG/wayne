import React from 'react';
import { OrderIDProvider } from './OrderIDContext';
import { ProductIDProvider } from './ProductIDContext';
import { StoredOrderProvider } from './StoredOrderIDContext';
import { CscProvider } from './CscContext';
import { CarrierIDProvider } from './CarrierIDContext';
import { AddressIDProvider } from './AddressIDContext';
import { PermissionsProvider } from './PermissionsContext';
import { I18nProvider } from './I18nContext';

export default function AppContextProvider({ children }) {
  return (
    <I18nProvider>
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
    </I18nProvider>
  );
}
