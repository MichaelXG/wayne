import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import DetailCard from './DetailCard';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import { useAddressIDContext } from '../../contexts/AddressIDContext';

export default function DetailPage() {
  const { id } = useParams();
  const addressId = id ? Number(id) : 1;

  const { setAddressId } = useAddressIDContext();

  useEffect(() => {
    if (addressId) setAddressId(addressId);
  }, [addressId, setAddressId]);

  const endpoint = useMemo(() => `${API_ROUTES.ADDRESS}${addressId}/`, [addressId]);

  const emptyMessage = {
    type: 'notFound',
    title: 'Address not found',
    description: 'We could not find the address you are looking for.'
  };

  const errorMessage = {
    type: 'error',
    title: 'Something went wrong',
    description: 'Failed to fetch address data. Please try again later.'
  };

  return (
    <DataLoaderWrapper endpoint={endpoint} emptyMessage={emptyMessage}>
      {(address, loading, error) => {
        if (isDebug) {
          console.log('%c📦 [DetailPage] Loaded address:', 'color: #00A76F; font-weight: bold;', address);
          if (loading) console.log('%c⏳ Loading...', 'color: #FFA726;');
          if (error) console.log('%c❌ Error fetching address', 'color: #FF5630;', error);
        }

        return error ? (
          <IllustrationMessage type={errorMessage.type} customTitle={errorMessage.title} customDescription={errorMessage.description} />
        ) : !address ? (
          <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />
        ) : (
          <DetailCard
            id={addressId}
            street={address.street}
            number={address.number}
            neighborhood={address.neighborhood}
            city={address.city}
            state={address.state}
            postal_code={address.postal_code}
            country={address.country}
            complement={address.complement}
            reference={address.reference}
            is_default={address.is_default}
            is_active={address.is_active}
          />
        );
      }}
    </DataLoaderWrapper>
  );
}
