import React from 'react';
import PropTypes from 'prop-types';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Box, Button, Divider } from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import GridToolbarDeleteSelected from '../toolbar/GridToolbarDeleteSelected';
import GridToolbarColumnsButtonCustom from '../toolbar/GridToolbarColumnsButtonCustom';
import GridToolbarFilterButtonCustom from '../toolbar/GridToolbarFilterButtonCustom';
import GridToolbarExportCustom from '../toolbar/GridToolbarExportCustom';
import ActiveFiltersBadge from '../ActiveFiltersBadge';

const CustomToolbarProduct = ({
  selectionModel = [],
  onDeleteSelected = () => {},
  hasFilters = false,
  filterModel = { items: [] },
  onClearFilters = () => {}
}) => {
  return (
    <GridToolbarContainer>
      {/* Top bar with quick filter and actions */}
      <Box
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 1,
          py: 1,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1
        })}
      >
        <GridToolbarQuickFilter
          sx={(theme) => ({
            width: 250,
            color: theme.palette.grey[300],
            '&:hover': {
              backgroundColor: theme.palette.grey[600]
            }
          })}
        />

        <Box display="flex" gap={1} flexWrap="wrap">
          <GridToolbarDeleteSelected selectionModel={selectionModel} onDeleteSelected={onDeleteSelected} menuName='products' />
          <GridToolbarColumnsButtonCustom />
          <GridToolbarFilterButtonCustom />
          <GridToolbarExportCustom />
        </Box>
      </Box>

      {/* Active filters as chips */}
      {hasFilters && (
        <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <ActiveFiltersBadge filterModel={filterModel} />

          <Button
            variant="text"
            color="error"
            startIcon={<Clear />}
            onClick={onClearFilters}
            sx={(theme) => ({
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme.palette.error.light
              }
            })}
          >
            Clear All
          </Button>
        </Box>
      )}

      <Divider sx={{ mt: 2 }} />
    </GridToolbarContainer>
  );
};

CustomToolbarProduct.propTypes = {
  selectionModel: PropTypes.array,
  onDeleteSelected: PropTypes.func,
  hasFilters: PropTypes.bool,
  filterModel: PropTypes.object,
  onClearFilters: PropTypes.func
};

export default CustomToolbarProduct;
