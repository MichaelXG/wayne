import React from 'react';
import { Typography } from '@mui/material';

export default function AddressBlock({ address }) {
  if (!address) return null;

  const { street, number, complement, postal_code, neighborhood, city, state, country, reference } = address;

  const line1 = [street, number, complement].filter(Boolean).join(', ');
  const line2 = [postal_code, neighborhood, city, state, country].filter(Boolean).join(' - ');
  const line3 = reference;

  return (
    <>
      <Typography variant="body2" fontWeight="bold">
        {line1}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {line2}
      </Typography>
      {line3 && (
        <Typography variant="body2" color="text.secondary">
          {line3}
        </Typography>
      )}
    </>
  );
}
