import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import DetailCard from './DetailCard';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import { useCarrierIDContext } from '../../contexts/CarrierIDContext';

export default function DetailPage() {
  const { id } = useParams();
  const carrierId = id ? Number(id) : 1;

  const { setCarrierId } = useCarrierIDContext();

  useEffect(() => {
    if (carrierId) setCarrierId(carrierId);
  }, [carrierId, setCarrierId]);

  const endpoint = useMemo(() => `${API_ROUTES.CARRIER}${carrierId}`, [carrierId]);

  const emptyMessage = {
    type: 'notFound',
    title: 'Carrier not found',
    description: 'We could not find the carrier you are looking for.'
  };

  const errorMessage = {
    type: 'error',
    title: 'Something went wrong',
    description: 'Failed to fetch carrier data. Please try again later.'
  };

  return (
    <DataLoaderWrapper endpoint={endpoint} emptyMessage={emptyMessage}>
      {(carrier, loading, error) => {
        if (isDebug) {
          console.log('%c📦 [DetailPage] Loaded carrier:', 'color: #00A76F; font-weight: bold;', carrier);
          if (loading) console.log('%c⏳ Loading...', 'color: #FFA726;');
          if (error) console.log('%c❌ Error fetching product', 'color: #FF5630;', error);
        }

        return error ? (
          <IllustrationMessage type={errorMessage.type} customTitle={errorMessage.title} customDescription={errorMessage.description} />
        ) : !carrier ? (
          <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />
        ) : (
          <DetailCard
            id={carrierId}
            name={carrier.name}
            slug={carrier.slug}
            prefix={carrier.prefix}
            is_default={carrier.is_default}
            is_active={carrier.is_active}
          />
        );
      }}
    </DataLoaderWrapper>
  );
}
