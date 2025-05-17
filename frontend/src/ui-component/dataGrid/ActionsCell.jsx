import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, Tooltip, Link } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon } from '@iconify/react';
import { BaseDir } from '../../App';

const ActionsCell = ({ params, onDelete, onDeleteItem, onEdit, variant = 'product' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const id = params?.row?.id;

  const configMap = {
    product: {
      view: `${BaseDir}/products/detail/${id}`,
      edit: `${BaseDir}/products/edit/${id}`,
      allowEdit: true
    },
    carrier: {
      view: `${BaseDir}/carrier/detail/${id}`,
      edit: `${BaseDir}/carrier/edit/${id}`,
      allowEdit: true
    },
    orders: {
      view: `${BaseDir}/orders/detail/${id}`,
      allowEdit: false
    },
    address: {
      view: `${BaseDir}/address/detail/${id}`,
      edit: `${BaseDir}/address/edit/${id}`,
      allowEdit: true
    },
    storedOrder: {
      view: `${BaseDir}/products/detail/${params.row?.product_id}`,
      allowEdit: true,
      customEdit: true
    }
  };

  const config = configMap[variant] || configMap.product;

  const handleDelete = () => {
    handleCloseMenu();
    if (variant === 'storedOrder' && onDeleteItem) {
      onDeleteItem(id);
    } else if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (config.customEdit && onEdit) {
      onEdit(params.row);
    }
  };

  return (
    <>
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
        <IconButton onClick={handleOpenMenu} size="small">
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            minWidth: 160,
            borderRadius: 1.5,
            boxShadow: (theme) => theme.shadows[8],
            p: 1
          }
        }}
      >
        {/* View */}
        <MenuItem component={Link} href={config.view} sx={{ typography: 'body2', borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Icon icon="solar:eye-bold" width={20} height={20} />
          </ListItemIcon>
          View
        </MenuItem>

        {/* Edit */}
        {config.allowEdit && !config.customEdit && config.edit && (
          <MenuItem component={Link} href={config.edit} sx={{ typography: 'body2', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:pen-bold" width={20} height={20} />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        {config.customEdit && (
          <MenuItem onClick={handleEdit} sx={{ typography: 'body2', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:pen-bold" width={20} height={20} />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        {/* Delete */}
        <MenuItem
          onClick={handleDelete}
          sx={{
            typography: 'body2',
            borderRadius: 1,
            color: 'error.main',
            '&:hover': { bgcolor: 'error.lighter' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: 'error.main' }}>
            <Icon icon="solar:trash-bin-trash-bold" width={20} height={20} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: 'error.main' }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionsCell;
