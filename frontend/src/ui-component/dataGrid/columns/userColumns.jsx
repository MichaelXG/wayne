import React from 'react';
import { Box, Avatar, Typography, Link, Tooltip } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ActionsCell from '../ActionsCell';
import { isDebug } from '../../../App';
import { API_BASE_URL } from '../../../routes/ApiRoutes';

const BASE_URL = 'http://localhost:8000'; // ajuste conforme necessário

const createUserColumns = (handleDelete) => {
  const baseColumns = [
    {
      field: 'first_name',
      headerName: 'User',
      flex: 1,
      minWidth: 280,
      maxWidth: 300,
      hideable: false,
      renderCell: (params) => {
        const full_name = `${params.row?.first_name || ''} ${params.row?.last_name || ''}`.trim() || 'No Name';
        const cpf = params.row?.cpf || 'No CPF';
        const userId = params.row?.id;

        let rawImage = params.row?.images?.[0]?.url || params.row?.images?.image || '';
        const image = rawImage?.startsWith('http') ? rawImage : `${API_BASE_URL}${rawImage}`;

        return (
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar
              alt={title}
              src={image}
              variant="rounded"
              sx={{
                width: 72,
                height: 72,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                backgroundColor: '#f9f9f9',
                objectFit: 'contain'
              }}
              imgProps={{ onError: (e) => (e.target.style.display = 'none') }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal !important',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  mb: 0.5
                }}
              >
                <Link href={`/wayne/users/detail/${userId ?? 1}`} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
                  {full_name}
                </Link>
              </Typography>
              <Typography variant="caption" color="textSecondary" noWrap>
                <Box component="span" fontWeight="bold">
                  CPF:
                </Box>{' '}
                {cpf}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      width: 130,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params?.row?.birth_date || 'dd/mm/yyyy'}
        </Typography>
      )
    },
    {
      field: 'phone',
      headerName: 'phone',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {!isNaN(params.row?.phone) ? params.row.phone : '(99) 99999-9999'}
        </Typography>
      )
    },
    {
      field: 'groups',
      headerName: 'Groups',
      hide: true,
      width: 180,
      renderCell: (params) => {
        const rawgroups = params?.row?.groups || [];
        const groups = Array.isArray(rawgroups) ? rawgroups : rawgroups ? [rawgroups] : [];
        return (
          <Box display="flex" gap={1} flexWrap="wrap">
            {groups.map((group, index) => (
              <Box key={index} display="flex" alignItems="center" gap={0.5}>
                <StarIcon color="primary" fontSize="small" />
                <Typography variant="body2">{group}</Typography>
              </Box>
            ))}
          </Box>
        );
      }
    },
    {
      field: 'is_staff',
      headerName: 'Staff',
      width: 120,
      renderCell: (params) => {
        const active = params?.row?.is_staff;
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
          <ActionsCell params={params} onDelete={(id) => handleDelete(id)} variant="users" />
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

export default createUserColumns;
