import React from 'react';
import { Typography, Box, Chip, Divider } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();

  if (!filterModel.items.length) return null;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant="body2" fontWeight="bold" mb={1} color={theme.palette.text.primary}>
        Active Filters:
      </Typography>

      <Divider sx={{ mt: 2, borderColor: theme.palette.divider }} />

      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
        {filterModel.items.map((item, index) => {
          const operator = operatorLabels[item.operator] || item.operator;
          const label = `${item.field} ${operator} ${item.value || '—'}`;

          return (
            <Chip
              key={index}
              icon={<FilterAltIcon fontSize="small" sx={{ color: theme.palette.grey[600] }} />}
              label={label}
              variant="outlined"
              size="small"
              sx={{
                color: theme.palette.grey[600],
                borderColor: theme.palette.grey[600],
                fontWeight: 500,
                textTransform: 'capitalize',
                backgroundColor: theme.palette.background.paper,
                '& .MuiChip-icon': {
                  color: theme.palette.grey[600]
                }
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ActiveFiltersBadge;
