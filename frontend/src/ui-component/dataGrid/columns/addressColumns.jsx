import React from 'react';
import { Box, Typography, Link, Tooltip } from '@mui/material';
import ActionsCell from '../ActionsCell';
import { formatCep } from '../../../utils/validator';
import { useTheme } from '@mui/material/styles';

const createAddressColumns = (handleDelete) => {
  const theme = useTheme();
  const baseColumns = [
    {
      field: 'street',
      headerName: 'Street',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const id = params.row?.id;
        const postal_code = params.row?.postal_code;
        const street = params.row?.street;
        const number = params.row?.number;
        const complement = params.row?.complement;
        const neighborhood = params.row?.neighborhood;
        const city = params.row?.city;
        const state = params.row?.state;
        const country = params.row?.country;
        return (
          <Box>
            <Typography variant="body2" fontWeight="bold">
              <Link href={`/wayne/address/detail/${id}`} underline="hover" color="inherit">
                {street}, {number}, {complement}
              </Link>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatCep(postal_code)} - {neighborhood} - {city} - {state} - {country}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'reference',
      headerName: 'Reference',
      minWidth: 200,
      renderCell: (params) => <Typography variant="body2">{params.row?.reference}</Typography>
    },
    {
      field: 'is_default',
      headerName: 'Default',
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight={600}
          sx={(theme) => ({
            color: params.row?.is_default ? theme.palette.success.main : theme.palette.text.secondary
          })}
        >
          {' '}
          {params.row?.is_default ? 'Yes' : 'No'}
        </Typography>
      )
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight={600}
          sx={(theme) => ({
            color: params.row?.is_active ? theme.palette.success.main : theme.palette.error.main
          })}
        >
          {' '}
          {params.row?.is_active ? 'Active' : 'Inactive'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 70,
      sortable: false,
      disableColumnSelector: true,
      renderCell: (params) => (
        <Tooltip
          title="Actions"
          placement="top"
          componentsProps={{
            tooltip: {
              sx: (theme) => ({
                backgroundColor: theme.palette.grey[600],
                color: theme.palette.common.white,
                fontSize: 12,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                boxShadow: theme.shadows[2]
              })
            }
          }}
        >
          <ActionsCell params={params} onDelete={(id) => handleDelete(id)} variant="address" />
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

export default createAddressColumns;
