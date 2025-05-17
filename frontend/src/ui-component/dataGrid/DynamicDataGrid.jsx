import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress } from '@mui/material';
import SummaryFooter from './SummaryFooter';
import ListItems from '../../views/orders/ExpandItem';
import createOrderColumns from './columns/orderColumns';

const DynamicDataGrid = ({
  data,
  columns,
  loading = false,
  slots,
  sx,
  selectionModel,
  setSelectionModel,
  filterModel,
  setFilterModel,
  summaryFooter = false
}) => {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
  const [expandedRow, setExpandedRow] = useState(null);
  const showEmptyState = !loading && (!data || data.length === 0);

  const handleExpandRow = (rowId) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId));
  };

  return (
    <Box sx={{ width: '100%', minHeight: '80vh', height: '100%' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2} width="100%">
          <CircularProgress />
        </Box>
      ) : showEmptyState ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          {slots?.noRowsOverlay?.() || <div>No data</div>}
        </Box>
      ) : (
        <>
          <DataGrid
            rows={Array.isArray(data) ? data : []}
            columns={columns}
            getRowId={(row) => row.id || row.product_id}
            checkboxSelection
            disableRowSelectionOnClick
            rowHeight={100}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 30, 40, 50, 100]}
            loading={loading}
            slots={slots}
            sx={sx}
            selectionModel={selectionModel}
            onRowSelectionModelChange={setSelectionModel}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
          />

          {expandedRow && (
            <Box sx={{ mt: 2, bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
              <ListItems items={data.find((r) => r.id === expandedRow)?.items || []} />
            </Box>
          )}

          {summaryFooter && <SummaryFooter data={data} />}
        </>
      )}
    </Box>
  );
};

DynamicDataGrid.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  slots: PropTypes.object,
  sx: PropTypes.object,
  selectionModel: PropTypes.array,
  setSelectionModel: PropTypes.func,
  filterModel: PropTypes.object,
  setFilterModel: PropTypes.func,
  summaryFooter: PropTypes.node
};

export default DynamicDataGrid;
