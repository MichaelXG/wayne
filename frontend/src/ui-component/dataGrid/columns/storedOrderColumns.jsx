import React from 'react';
import { Box, Avatar, Typography, Link, Tooltip } from '@mui/material';
import { isDebug } from '../../../App';
import ActionsCell from '../ActionsCell';
import useProductData from '../../../hooks/useProductData';

const createStoredOrderColumns = (onDelete, onDeleteItem, onEdit, showStock = false) =>
  [
    {
      field: 'title',
      headerName: 'Product',
      flex: 1,
      minWidth: 280,
      maxWidth: 300,
      hideable: false,
      renderCell: (params) => {
        const id = params.row?.id;
        const { data: product, loading } = useProductData(id);

        const title = product?.title || 'No Product';
        const image = product?.images?.[0]?.url || product?.images?.image || '';
        const skuCode = product?.sku || '';

        if (isDebug) {
          console.log('🧩 Render Order - title cell:', { id, title, skuCode });
        }

        return (
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar
              alt={title}
              src={image}
              variant="rounded"
              sx={{
                width: 72,
                height: 72,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                backgroundColor: '#f9f9f9',
                objectFit: 'contain'
              }}
              imgProps={{ onError: (e) => (e.target.style.display = 'none') }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal !important',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  mb: 0.5
                }}
              >
                <Link href={`/f-store/products/detail/${id ?? 1}`} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
                  {title}
                </Link>
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
                <Box component="span" fontWeight="bold">
                  SKU:
                </Box>{' '}
                {skuCode}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 120,
      renderCell: (params) => {
        const quantity = Number(params?.row?.quantity);
        return (
          <Typography variant="body2" color="text.secondary">
            {!isNaN(quantity) ? quantity.toFixed(2) : '0.00'}
          </Typography>
        );
      }
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderCell: (params) => {
        const price = Number(params.row?.price || 0);
        return (
          <Typography variant="body2" color="text.primary">
            {!isNaN(price) ? `$ ${price.toFixed(2)}` : '$0.00'}
          </Typography>
        );
      }
    },
    {
      field: 'actions',
      headerName: '',
      width: 70,
      hideable: false,
      sortable: false,
      disableColumnSelector: true,
      renderCell: (params) => (
        <Tooltip
          title="Actions"
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: '#8E33FF',
                color: '#fff',
                fontSize: 12,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                boxShadow: 2
              }
            }
          }}
        >
          <ActionsCell
            params={params}
            onDeleteItem={onDeleteItem} // ✅ corrige aqui
            onEdit={onEdit} // ✅ corrige aqui
            variant="storedOrder"
          />
        </Tooltip>
      )
    },
    {
      field: 'stock',
      headerName: showStock ? 'Stock' : '',
      width: showStock ? 120 : -1,
      renderCell: (params) => {
        if (!showStock) return null;
        const stock = Number(params?.row?.stock);
        return (
          <Typography variant="body2" color="text.secondary">
            {!isNaN(stock) ? stock.toFixed(2) : '0.00'}
          </Typography>
        );
      }
    }
  ].map((col) => ({
    ...col,
    cellClassName: 'leftCell', // ou remova se quiser usar `align`
    align: 'left', // conteúdo da célula alinhado à esquerda
    headerAlign: 'left' // cabeçalho alinhado à esquerda
  }));

export default createStoredOrderColumns;
