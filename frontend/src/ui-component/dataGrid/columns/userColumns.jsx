import React, { useContext } from 'react';
import { Box, Avatar, Typography, Link, Tooltip } from '@mui/material';
import ActionsCell from '../ActionsCell';
import { API_BASE_URL } from '../../../routes/ApiRoutes';
import { maskCPFGPT, formatDate, formatPhone } from '../../../utils/validator';

const createUserColumns = (handleDelete, theme, locale = 'en-US') => {
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
        const cpf = maskCPFGPT(params.row?.cpf || '');
        const userId = params.row?.id;

        const rawImage = params.row?.avatar_data?.image || '';
        const image = rawImage?.startsWith('http') ? rawImage : `${API_BASE_URL}${rawImage}`;

        return (
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Avatar
              alt={full_name}
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
      field: 'email',
      headerName: 'Email',
      width: 250,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params?.row?.email || 'no email'}
        </Typography>
      )
    },
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      width: 130,
      hide: true,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params?.row?.birth_date, locale)}
        </Typography>
      )
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatPhone(params?.row?.phone || '')}
        </Typography>
      )
    },
    {
      field: 'groups',
      headerName: 'Groups',
      hide: true,
      width: 180,
      renderCell: (params) => {
        const rawGroups = params?.row?.groups || [];
        const groups = Array.isArray(rawGroups) ? rawGroups : [];

        return (
          <Box display="flex" gap={1} flexWrap="wrap">
            {groups.map((group, index) => (
              <Box key={index} display="flex" alignItems="center" gap={0.5}>
                <Typography variant="body2">{group.name}</Typography>
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
            {active ? 'Yes' : 'No'}
          </Typography>
        );
      }
    },
    {
      field: 'is_superuser',
      headerName: 'Super User',
      width: 120,
      renderCell: (params) => {
        const active = params?.row?.is_superuser;
        return (
          <Typography
            variant="body2"
            sx={{
              color: active ? 'success.main' : 'error.main',
              fontWeight: 600
            }}
          >
            {active ? 'Yes' : 'No'}
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
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                fontSize: 12,
                px: theme.spacing(1.5),
                py: theme.spacing(0.5),
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[2]
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
