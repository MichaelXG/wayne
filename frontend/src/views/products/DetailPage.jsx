import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { API_ROUTES } from '../../routes/ApiRoutes';
import DataLoaderWrapper from '../../ui-component/dataGrid/DataLoaderWrapper';
import DetailCard from './DetailCard';
import IllustrationMessage from '../../ui-component/message/IllustrationMessage';
import { isDebug } from '../../App';
import { useProductIDContext } from '../../contexts/ProductIDContext';

export default function DetailPage() {
  const { id } = useParams();
  const productId = id ? Number(id) : 1;

  const { setProductId } = useProductIDContext();

  useEffect(() => {
    if (productId) setProductId(productId);
  }, [productId, setProductId]);

  const endpoint = useMemo(() => `${API_ROUTES.PRODUCTS}${productId}`, [productId]);

  const emptyMessage = {
    type: 'notFound',
    title: 'Product not found',
    description: 'We could not find the product you are looking for.'
  };

  const errorMessage = {
    type: 'error',
    title: 'Something went wrong',
    description: 'Failed to fetch product data. Please try again later.'
  };

  return (
    <DataLoaderWrapper endpoint={endpoint} emptyMessage={emptyMessage}>
      {(product, loading, error) => {
        if (isDebug) {
          console.log('%c📦 [DetailPage] Loaded product:', 'color: #00A76F; font-weight: bold;', product);
          if (loading) console.log('%c⏳ Loading...', 'color: #FFA726;');
          if (error) console.log('%c❌ Error fetching product', 'color: #FF5630;', error);
        }

        return error ? (
          <IllustrationMessage type={errorMessage.type} customTitle={errorMessage.title} customDescription={errorMessage.description} />
        ) : !product ? (
          <IllustrationMessage type={emptyMessage.type} customTitle={emptyMessage.title} customDescription={emptyMessage.description} />
        ) : (
          <DetailCard
            id={productId}
            title={product.title}
            status={product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            isNew={true}
            images={
              Array.isArray(product.images) && product.images.length > 0
                ? product.images.map((img) =>
                    img.url?.startsWith('http') ? img.url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${img.url}`
                  )
                : ['https://via.placeholder.com/300x300?text=No+Image']
            }
            category={product.category}
            description={product.description}
            code={product.code}
            sku={product.sku}
            gender={product.gender}
            quantity={product.quantity}
            price={{
              regular: product.price?.sale,
              sale: product.price?.sale,
              tax: product.price?.tax
            }}
            rating={{
              rate: product.rating?.rate,
              count: product.rating?.count
            }}
            is_active={product.is_active}
          />
        );
      }}
    </DataLoaderWrapper>
  );
}
