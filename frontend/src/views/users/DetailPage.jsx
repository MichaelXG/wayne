import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { API_BASE_URL, API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import DetailCard from './DetailCard';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import { useUserIDContext } from '../../contexts/UserIDContext';

export default function DetailPage() {
  const { id } = useParams();
  const userId = id ? Number(id) : 1;

  const { setUserId } = useUserIDContext();

  useEffect(() => {
    if (userId) setUserId(userId);
  }, [userId, setUserId]);

  const endpoint = useMemo(() => `${API_ROUTES.USERS}${userId}`, [userId]);

  const emptyMessage = {
    type: 'notFound',
    title: 'User not found',
    description: 'We could not find the user you are looking for.'
  };

  const errorMessage = {
    type: 'error',
    title: 'Something went wrong',
    description: 'Failed to fetch user data. Please try again later.'
  };

  return (
    <DataLoaderWrapper endpoint={endpoint} emptyMessage={emptyMessage}>
      {(user, loading, error) => {
        if (isDebug) {
          console.log('%c📦 [DetailPage] Loaded user:', 'color: #00A76F; font-weight: bold;', user);
          if (loading) console.log('%c⏳ Loading...', 'color: #FFA726;');
          if (error) console.log('%c❌ Error fetching user', 'color: #FF5630;', error);
        }

        return error ? (
          <IllustrationMessage type={errorMessage.type} customTitle={errorMessage.title} customDescription={errorMessage.description} />
        ) : !user ? (
          <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />
        ) : (
          <DetailCard
            id={userId}
            title={user.title}
            status={user.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            isNew={true}
            images={
              Array.isArray(user.images) && user.images.length > 0
                ? user.images.map((img) =>
                    img.url?.startsWith('http') ? img.url : `${API_BASE_URL || 'http://localhost:8000'}${img.url}`
                  )
                : ['https://via.placeholder.com/300x300?text=No+Image']
            }
            category={user.category}
            description={user.description}
            code={user.code}
            sku={user.sku}
            quantity={user.quantity}
            price={{
              regular: user.price?.sale,
              sale: user.price?.sale,
              tax: user.price?.tax
            }}
            rating={{
              rate: user.rating?.rate,
              count: user.rating?.count
            }}
            is_active={user.is_active}
          />
        );
      }}
    </DataLoaderWrapper>
  );
}
