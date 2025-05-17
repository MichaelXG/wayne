import React from 'react';
import PropTypes from 'prop-types';
import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { Box, Typography, Button, Divider, Chip } from '@mui/material';
import Clear from '@mui/icons-material/Clear';
import GridToolbarDeleteSelected from '../toolbar/GridToolbarDeleteSelected';
import GridToolbarColumnsButtonCustom from '../toolbar/GridToolbarColumnsButtonCustom';
import ActiveFiltersBadge from '../ActiveFiltersBadge';

const CustomToolbarCarrier = ({
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
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 1,
          py: 1,
          backgroundColor: '#f9fafb',
          borderRadius: 1
        }}
      >
        <GridToolbarQuickFilter
          sx={{
            width: 250,
            color: 'secondary.main',
            '&:hover': {
              backgroundColor: 'secondary.light'
            }
          }}
        />

        <Box display="flex" gap={1} flexWrap="wrap">
          <GridToolbarDeleteSelected selectionModel={selectionModel} onDeleteSelected={onDeleteSelected} />
          <GridToolbarColumnsButtonCustom />
          <GridToolbarFilterButton />
          <GridToolbarExport />
        </Box>
      </Box>

      {/* Active filters as chips */}
      {hasFilters && (
        <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <ActiveFiltersBadge filterModel={filterModel} />

          <Button variant="text" color="error" startIcon={<Clear />} onClick={onClearFilters}>
            Clear All
          </Button>
        </Box>
      )}

      <Divider sx={{ mt: 2 }} />
    </GridToolbarContainer>
  );
};

CustomToolbarCarrier.propTypes = {
  selectionModel: PropTypes.array,
  onDeleteSelected: PropTypes.func,
  hasFilters: PropTypes.bool,
  filterModel: PropTypes.object,
  onClearFilters: PropTypes.func
};

export default CustomToolbarCarrier;
