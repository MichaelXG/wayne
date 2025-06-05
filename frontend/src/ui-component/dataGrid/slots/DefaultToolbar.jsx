import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import GridToolbarColumnsButtonCustom from '../toolbar/GridToolbarColumnsButtonCustom';
import GridToolbarFilterButtonCustom from '../toolbar/GridToolbarFilterButtonCustom';
import GridToolbarExportCustom from '../toolbar/GridToolbarExportCustom';

const DefaultToolbar = () => (
  <GridToolbarContainer>
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} width="100%" p={1}>
      <GridToolbarQuickFilter />
      <Box display="flex" gap={1}>
        <GridToolbarColumnsButtonCustom />
        <GridToolbarFilterButtonCustom />
        <GridToolbarExportCustom />
      </Box>
    </Box>
  </GridToolbarContainer>
);

export default DefaultToolbar;
