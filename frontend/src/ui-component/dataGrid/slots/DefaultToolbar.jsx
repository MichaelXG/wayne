import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DefaultToolbar = () => (
  <GridToolbarContainer>
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} width="100%" p={1}>
      <GridToolbarQuickFilter />
      <Box display="flex" gap={1}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </Box>
    </Box>
  </GridToolbarContainer>
);

export default DefaultToolbar;
