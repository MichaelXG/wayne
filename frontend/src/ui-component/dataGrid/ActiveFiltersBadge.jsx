import React from 'react';
import { Typography, Box, Chip, Divider } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const operatorLabels = {
  contains: 'contains',
  equals: '=',
  startsWith: 'starts with',
  endsWith: 'ends with',
  is: '=',
  not: '≠',
  after: '>',
  onOrAfter: '≥',
  before: '<',
  onOrBefore: '≤',
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
  isAnyOf: 'any of'
};

const ActiveFiltersBadge = ({ filterModel = { items: [] } }) => {
  if (!filterModel.items.length) return null;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="body2" fontWeight="bold" mb={1}>
        Active Filters:
      </Typography>

      <Divider sx={{ mt: 2 }} />

      <Box display="flex" gap={1} flexWrap="wrap">
        {filterModel.items.map((item, index) => {
          const operator = operatorLabels[item.operator] || item.operator;
          const label = `${item.field} ${operator} ${item.value || '—'}`;

          return (
            <Chip key={index} icon={<FilterAltIcon fontSize="small" />} label={label} color="secondary" variant="outlined" size="small" />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveFiltersBadge;
