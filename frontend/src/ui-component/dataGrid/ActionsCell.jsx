 import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, Tooltip, Link } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon } from '@iconify/react';
import { BaseDir } from '../../App';
import DynamicModal from '../../ui-component/modal/DynamicModal';
import { usePermissions } from '../../contexts/PermissionsContext';

const ActionsCell = ({ params, onDelete, onDeleteItem, onEdit, variant = 'product' }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const { hasPermission } = usePermissions();

  const open = Boolean(anchorEl);
  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const id = params?.row?.id;

  const configMap = {
    product: {
      view: `${BaseDir}/products/detail/${id}`,
      edit: `${BaseDir}/products/edit/${id}`,
      allowEdit: true,
      permissions: {
        view: { menu: 'products', action: 'can_read' },
        edit: { menu: 'products', action: 'can_update' },
        delete: { menu: 'products', action: 'can_delete' }
      }
    },
    carrier: {
      view: `${BaseDir}/carrier/detail/${id}`,
      edit: `${BaseDir}/carrier/edit/${id}`,
      allowEdit: true,
      permissions: {
        view: { menu: 'carrier', action: 'can_read' },
        edit: { menu: 'carrier', action: 'can_update' },
        delete: { menu: 'carrier', action: 'can_delete' }
      }
    },
    orders: {
      view: `${BaseDir}/orders/detail/${id}`,
      allowEdit: false,
      permissions: {
        view: { menu: 'order', action: 'can_read' }
      }
    },
    address: {
      view: `${BaseDir}/address/detail/${id}`,
      edit: `${BaseDir}/address/edit/${id}`,
      allowEdit: true,
      permissions: {
        view: { menu: 'address', action: 'can_read' },
        edit: { menu: 'address', action: 'can_update' },
        delete: { menu: 'address', action: 'can_delete' }
      }
    },
    storedOrder: {
      view: `${BaseDir}/products/detail/${params.row?.product_id}`,
      allowEdit: true,
      customEdit: true,
      permissions: {
        view: { menu: 'products', action: 'can_read' },
        edit: { menu: 'products', action: 'can_update' }
      }
    },
    users: {
      view: `${BaseDir}/users/detail/${id}`,
      edit: `${BaseDir}/users/edit/${id}`,
      allowEdit: true,
      permissions: {
        view: { menu: 'users', action: 'can_read' },
        edit: { menu: 'users', action: 'can_update' },
        delete: { menu: 'users', action: 'can_delete' }
      }
    }
  };

  const config = configMap[variant] || configMap.product;

  const canView = config.permissions?.view ? hasPermission(config.permissions.view.menu, config.permissions.view.action) : true;
  const canEdit = config.permissions?.edit ? hasPermission(config.permissions.edit.menu, config.permissions.edit.action) : true;
  const canDelete = config.permissions?.delete ? hasPermission(config.permissions.delete.menu, config.permissions.delete.action) : true;

  const handleDelete = () => {
    handleCloseMenu();

    if (!canDelete) {
      setPermissionModalOpen(true);
      return;
    }

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
              backgroundColor: theme.palette.grey[600],
              color: theme.palette.common.white,
              fontSize: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              boxShadow: theme.shadows[2]
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
            boxShadow: theme.shadows[8],
            p: 1
          }
        }}
      >
        {canView && (
          <MenuItem component={Link} href={config.view} sx={{ typography: 'body2', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:eye-bold" width={20} height={20} />
            </ListItemIcon>
            View
          </MenuItem>
        )}

        {canEdit && config.allowEdit && !config.customEdit && config.edit && (
          <MenuItem component={Link} href={config.edit} sx={{ typography: 'body2', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:pen-bold" width={20} height={20} />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        {canEdit && config.customEdit && (
          <MenuItem onClick={handleEdit} sx={{ typography: 'body2', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:pen-bold" width={20} height={20} />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        <MenuItem
          onClick={handleDelete}
          sx={{
            typography: 'body2',
            borderRadius: 1,
            color: theme.palette.error.main,
            '&:hover': {
              bgcolor: theme.palette.error.light
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 28, color: theme.palette.error.main }}>
            <Icon icon="solar:trash-bin-trash-bold" width={20} height={20} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      <DynamicModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        onSubmit={() => setPermissionModalOpen(false)}
        title="Permission Denied"
        description="You do not have permission to delete this item."
        type="error"
        mode="alert"
      />
    </>
  );
};

export default ActionsCell;
