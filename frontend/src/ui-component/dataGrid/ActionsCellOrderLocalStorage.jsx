import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, Link, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon } from '@iconify/react';
import { BaseDir } from '../../App';
import { usePermissions } from '../../contexts/PermissionsContext';
import DynamicModal from '../../ui-component/modal/DynamicModal';

const ActionsCellOrderLocalStorage = ({ params, onDelete, onDeleteItem, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const { hasPermission } = usePermissions();
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const canView = hasPermission('orders', 'can_read');
  const canEdit = hasPermission('orders', 'can_update');
  const canDelete = hasPermission('orders', 'can_delete');

  const handleDelete = () => {
    handleCloseMenu();

    if (!canDelete) {
      setPermissionModalOpen(true);
      return;
    }

    setPendingDelete(() => () => {
      if (onDeleteItem) onDeleteItem(params.row.id);
    });

    setConfirmDeleteModalOpen(true);
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (!canEdit) {
      setPermissionModalOpen(true);
      return;
    }
    if (onEdit) onEdit(params.row); 
  };

  return (
    <>
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
        <IconButton onClick={handleOpenMenu} size="small">
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: (theme) => ({
            minWidth: 160,
            borderRadius: 1.5,
            boxShadow: theme.shadows[8],
            p: 1
          })
        }}
      >
        {canView && (
          <MenuItem
            component={Link}
            href={`${BaseDir}/products/detail/${params.row.product_id}`}
            sx={{ typography: 'body2', borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:eye-bold" width={20} height={20} />
            </ListItemIcon>
            View
          </MenuItem>
        )}

        {canEdit && (
          <MenuItem onClick={handleEdit} sx={{ typography: 'body2', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <Icon icon="solar:pen-bold" width={20} height={20} />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}

        {canDelete && (
          <MenuItem
            onClick={handleDelete}
            sx={(theme) => ({
              typography: 'body2',
              borderRadius: 1,
              color: theme.palette.error.main,
              '&:hover': { bgcolor: theme.palette.error.light }
            })}
          >
            <ListItemIcon sx={(theme) => ({ minWidth: 28, color: theme.palette.error.main })}>
              <Icon icon="solar:trash-bin-trash-bold" width={20} height={20} />
            </ListItemIcon>
            <Typography variant="body2" sx={(theme) => ({ color: theme.palette.error.main })}>
              Delete
            </Typography>
          </MenuItem>
        )}
      </Menu>

      <DynamicModal
        open={confirmDeleteModalOpen}
        onClose={() => {
          setConfirmDeleteModalOpen(false);
          setPendingDelete(null);
        }}
        onSubmit={() => {
          if (pendingDelete) pendingDelete();
          setConfirmDeleteModalOpen(false);
          setPendingDelete(null);
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action cannot be undone."
        type="error"
        mode="confirm"
        submitLabel="Delete"
      />

      <DynamicModal
        open={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        onSubmit={() => setPermissionModalOpen(false)}
        title="Permission Denied"
        description="You do not have permission to perform this action."
        type="error"
        mode="alert"
      />
    </>
  );
};

export default ActionsCellOrderLocalStorage;
