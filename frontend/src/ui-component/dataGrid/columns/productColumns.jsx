import React from 'react';
import { Box, Avatar, Typography, Link, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ActionsCell from '../ActionsCell';
import { isDebug } from '../../../App';

const BASE_URL = 'http://localhost:8000'; // ajuste conforme necessário

const createProductColumns = (handleDelete) => {
  const baseColumns = [
    {
      field: 'title',
      headerName: 'Product',
      flex: 1,
      minWidth: 280,
      maxWidth: 300,
      hideable: false,
      renderCell: (params) => {
        const title = params.row?.title || 'No Product';
        const category = params.row?.category || 'No Category';
        const productId = params.row?.id;
        const skuCode = params.row?.sku || '';

        let rawImage = params.row?.images?.[0]?.url || params.row?.images?.image || '';
        const image = rawImage?.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`;

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
                <Link
                  href={`/f-store/products/detail/${productId ?? 1}`}
                  style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                >
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
      field: 'category',
      headerName: 'Category',
      hide: true,
      width: 180,
      renderCell: (params) => {
        const rawCategory = params?.row?.category;
        const categories = Array.isArray(rawCategory) ? rawCategory : rawCategory ? [rawCategory] : [];
        return (
          <Box display="flex" gap={1} flexWrap="wrap">
            {categories.map((cat, index) => (
              <Box key={index} display="flex" alignItems="center" gap={0.5}>
                <StarIcon color="primary" fontSize="small" />
                <Typography variant="body2">{cat}</Typography>
              </Box>
            ))}
          </Box>
        );
      }
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 280,
      renderCell: (params) => (
        <Box
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal !important',
            wordBreak: 'break-word',
            lineHeight: 1.5
          }}
        >
          <Typography variant="body2">{params.row?.description || 'No description'}</Typography>
        </Box>
      )
    },
    {
      field: 'code',
      headerName: 'Code',
      width: 130,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params?.row?.code || '********'}
        </Typography>
      )
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {!isNaN(params.row?.quantity) ? params.row.quantity.toFixed(2) : '0.00'}
        </Typography>
      )
    },
    {
      field: 'price_regular',
      headerName: 'Regular Price',
      width: 130,
      renderCell: (params) => {
        const price = params.row?.price || {};
        return (
          <Typography variant="body2" color="text.secondary">
            {!isNaN(price?.regular) ? `$ ${price.regular.toFixed(2)}` : '$0.00'}
          </Typography>
        );
      }
    },
    {
      field: 'price_sale',
      headerName: 'Sale Price',
      width: 120,
      renderCell: (params) => {
        const price = params.row?.price || {};
        return (
          <Typography variant="body2" color="text.primary">
            {!isNaN(price?.sale) ? `$ ${price.sale.toFixed(2)}` : '$0.00'}
          </Typography>
        );
      }
    },
    {
      field: 'tax',
      headerName: 'Tax %',
      renderCell: (params) => {
        const price = params.row?.price || {};
        return (
          <Typography variant="body2" color="text.secondary">
            {!isNaN(price?.tax) ? `% ${price.tax.toFixed(2)}` : '%0.00'}
          </Typography>
        );
      }
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 200,
      renderCell: (params) => {
        const rating = params.row?.rating || {};
        return (
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
            <Tooltip title={`Rating: ${rating?.rate}/5`} placement="top" arrow>
              <Box display="inline-block">
                <Rating value={rating.rate} precision={0.1} readOnly size="medium" />
              </Box>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              ({rating.count ?? 0} reviews)
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const active = params?.row?.is_active;
        return (
          <Typography
            variant="body2"
            sx={{
              color: active ? 'success.main' : 'error.main',
              fontWeight: 600
            }}
          >
            {active ? 'Active' : 'Inactive'}
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
          <ActionsCell params={params} onDelete={(id) => handleDelete(id)} variant="products" />
        </Tooltip>
      )
    }
  ];

  return baseColumns.map((col) => ({
    ...col,
    cellClassName: 'leftCell',
    align: 'left',
    headerAlign: 'left'
  }));
};

export default createProductColumns;
