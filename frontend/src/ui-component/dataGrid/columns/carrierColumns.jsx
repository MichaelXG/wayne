import React from 'react';
import { Box, Typography, Link, Tooltip } from '@mui/material';
import ActionsCell from '../ActionsCell';

const createCarrierColumns = (handleDelete) => {
  const baseColumns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 280,
      maxWidth: 300,
      hideable: false,
      renderCell: (params) => {
        const name = params.row?.name || 'No carrier name';
        const carrierId = params.row?.id;
        const prefix = params.row?.prefix || 'No prefix';

        return (
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight="bold">
                <Link href={`/wayne/carrier/detail/${carrierId ?? 1}`} underline="hover" color="inherit">
                  {name}
                </Link>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prefix: {prefix}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'slug',
      headerName: 'Slug',
      flex: 1,
      minWidth: 150,
      sortable: true,
        renderCell: (params) => params.row?.slug || '-'
    },
    {
      field: 'is_default',
      headerName: 'Default',
      width: 100,
      renderCell: (params) => {
        const isDefault = params?.row?.is_default;
        return (
          <Typography variant="body2" color={isDefault ? 'success.main' : 'text.secondary'} fontWeight={600}>
            {isDefault ? 'Yes' : 'No'}
          </Typography>
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
          <ActionsCell params={params} onDelete={(id) => handleDelete(id)} variant="carrier" />
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

export default createCarrierColumns;
