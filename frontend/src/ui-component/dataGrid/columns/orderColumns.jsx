import React from 'react';
import { IconButton, Typography, Avatar, Tooltip, Chip, Stack } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { IconClockHour4, IconCheck, IconPackage, IconTruckDelivery, IconBan } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ActionsCell from '../ActionsCell';
import useFetchData from '../../../hooks/useFetchData';
import { API_ROUTES } from '../../../routes/ApiRoutes';

const createOrderColumns = (handleExpandRow, handleDeleteItem, expandedRow) => {
  const theme = useTheme();

  const tooltipStyle = {
    backgroundColor: theme.palette.grey[500],
    color: theme.palette.primary.contrastText,
    fontSize: 12,
    px: 1.5,
    py: 0.5,
    borderRadius: 1,
    boxShadow: theme.shadows[2]
  };

  const baseColumns = [
    {
      field: 'code',
      headerName: 'Order',
      width: 100,
      renderCell: (params) => (
        <Tooltip
          title="Order Id"
          placement="top"
          componentsProps={{
            tooltip: {
              sx: tooltipStyle
            }
          }}
        >
          <Link to={`/orders/detail/${params.row.id}`} underline="always" style={{ fontWeight: 600, color: theme.palette.primary.main }}>
            #{params.row.code || '----'}
          </Link>
        </Tooltip>
      )
    },
    {
      field: 'user',
      headerName: 'Customer',
      width: 280,
      renderCell: (params) => {
        const user = params.row.user;
        const { data: avatar } = useFetchData(`${API_ROUTES.AVATARS}me/?id=${user?.id}`);

        const user_avatar = avatar?.image || null;

        if (!user) return '---';

        return (
          <Chip
            color="secondary" 
            sx={{
              height: '48px',
              alignItems: 'center',
              borderRadius: '27px',
              pl: 0.5,
              pr: 1.5,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 1 }
            }}
            avatar={
              <Avatar
                src={user_avatar}
                alt={user?.full_name}
                sx={{
                  width: 42,
                  height: 42,
                  margin: '8px 0 8px 8px !important'
                }}
              />
            }
            label={
              <Stack direction="column" spacing={0}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.full_name || '---'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.email || ''}
                </Typography>
              </Stack>
            }
            variant="outlined"
          />
        );
      }
    },
    {
      field: 'created_at',
      headerName: 'Date',
      width: 130,
      renderCell: (params) => {
        const date = new Date(params.row.created_at);
        const dateFormatted = date.toLocaleDateString('en-US', { dateStyle: 'medium' });
        const timeFormatted = date.toLocaleTimeString('en-US', { timeStyle: 'short' });

        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2">{dateFormatted}</Typography>
            <Typography variant="caption" color="text.secondary">
              {timeFormatted}
            </Typography>
          </div>
        );
      }
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 80,
      renderCell: (params) => {
        const totalItems = params.row.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        return <Typography fontWeight={600}>{totalItems}</Typography>;
      }
    },
    {
      field: 'sub_total',
      headerName: 'Sub.Total ($)',
      width: 130,
      renderCell: (params) => <Typography>$ {parseFloat(params.row.sub_total || 0).toFixed(2)}</Typography>
    },
    {
      field: 'discount',
      headerName: 'Discount ($)',
      width: 130,
      renderCell: (params) => <Typography>$ {parseFloat(params.row.discount || 0).toFixed(2)}</Typography>
    },
    {
      field: 'shippingFee',
      headerName: 'ShippingFee ($)',
      width: 150,
      renderCell: (params) => <Typography>$ {parseFloat(params.row.shippingFee || 0).toFixed(2)}</Typography>
    },
    {
      field: 'tax',
      headerName: 'Tax ($)',
      width: 100,
      renderCell: (params) => <Typography>$ {parseFloat(params.row.tax || 0).toFixed(2)}</Typography>
    },
    {
      field: 'total',
      headerName: 'Total ($)',
      width: 130,
      renderCell: (params) => <Typography>$ {parseFloat(params.row.total || 0).toFixed(2)}</Typography>
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      type: 'singleSelect',
      valueOptions: ['pending', 'paid', 'processing', 'shipped', 'canceled'],
      filterable: true,
      renderCell: (params) => {
        const status = params.row.status;

        const statusColors = {
          pending: theme.palette.warning.main,
          paid: theme.palette.success.main,
          processing: theme.palette.info.main,
          shipped: theme.palette.primary.main,
          canceled: theme.palette.error.main
        };

        const statusIcons = {
          pending: <IconClockHour4 size={16} />,
          paid: <IconCheck size={16} />,
          processing: <IconPackage size={16} />,
          shipped: <IconTruckDelivery size={16} />,
          canceled: <IconBan size={16} />
        };

        return (
          <Chip
            icon={statusIcons[status] || <IconClockHour4 size={16} />}
            label={status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
            sx={{
              backgroundColor: alpha(statusColors[status] || theme.palette.grey[500], 0.1),
              color: statusColors[status] || theme.palette.grey[700],
              borderColor: alpha(statusColors[status] || theme.palette.grey[500], 0.2),
              '& .MuiChip-icon': {
                color: 'inherit'
              }
            }}
            variant="outlined"
            size="small"
          />
        );
      }
    },
    {
      field: 'expand',
      headerName: '',
      width: 70,
      sortable: false,
      disableColumnSelector: true,
      renderCell: (params) => {
        const isExpanded = expandedRow === params.row.id;

        return (
          <Tooltip
            title={isExpanded ? 'Hide' : 'Expand'}
            placement="top"
            componentsProps={{
              tooltip: {
                sx: tooltipStyle
              }
            }}
          >
            <IconButton onClick={() => handleExpandRow(params.row.id)}>
              <KeyboardArrowDownIcon
                sx={{
                  transition: 'transform 0.3s ease',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </IconButton>
          </Tooltip>
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
              sx: tooltipStyle
            }
          }}
        >
          <ActionsCell params={params} onDelete={(id) => handleDeleteItem(id)} variant="orders" />
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

export default createOrderColumns;
