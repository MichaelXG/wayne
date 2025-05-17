import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const ExpandItem = ({ items }) => {
  if (!items || items.length === 0) {
    return <Typography sx={{ p: 2, color: 'text.secondary' }}>No items in this order.</Typography>;
  }

  return (
    <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #ddd' }}>
      <Typography variant="subtitle2" gutterBottom>
        Order Items:
      </Typography>

      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            py: 1,
            borderBottom: '1px solid #eee'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Avatar
              variant="rounded"
              src={item.image}
              alt={item.title}
              sx={{ width: 48, height: 48, borderRadius: 2 }}
              imgProps={{ onError: (e) => (e.target.style.display = 'none') }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">{item.title || 'Unnamed Product'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.sku || `#${item.product_id}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ minWidth: 40, textAlign: 'center' }}>
            <Typography variant="body2">x{item.quantity}</Typography>
          </Box>

          <Box sx={{ minWidth: 60, textAlign: 'right' }}>
            <Typography variant="body2">${Number(item.price).toFixed(2)}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ExpandItem;
