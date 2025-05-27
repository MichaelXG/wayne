import React from 'react';
import { OrderIDProvider } from './OrderIDContext';
import { ProductIDProvider } from './ProductIDContext';
import { StoredOrderProvider } from './StoredOrderIDContext';
import { CscProvider } from './CscContext';
import { CarrierIDProvider } from './CarrierIDContext';
import { AddressIDProvider } from './AddressIDContext';
import { PermissionsProvider } from './PermissionsContext';
import { PermissionsGroupsProvider } from './PermissionsGroupsContext';
import { I18nProvider } from './I18nContext';

export default function AppContextProvider({ children }) {
  return (
    <I18nProvider>
      <PermissionsProvider>
        <PermissionsGroupsProvider>
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
        </PermissionsGroupsProvider>
      </PermissionsProvider>
    </I18nProvider>
  );
}
