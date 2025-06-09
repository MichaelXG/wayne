import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Tooltip, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon } from '@iconify/react';

export default function CardActionsMenu({ onEdit, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleEditClick = () => {
    handleCloseMenu();
    if (onEdit) onEdit();
  };

  const handleDeleteClick = () => {
    handleCloseMenu();
    if (onDelete) onDelete();
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
        <IconButton
          onClick={handleOpenMenu}
          size="small"
          sx={(theme) => ({
            bgcolor: theme.palette.grey[300],
            color: theme.palette.grey[600],
            '&:hover': {
              bgcolor: theme.palette.grey[600],
              color: theme.palette.common.white
            }
          })}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            minWidth: 140,
            borderRadius: 2,
            p: 1,
            boxShadow: (theme) => theme.shadows[8]
          }
        }}
      >
        <MenuItem onClick={handleEditClick} sx={{ typography: 'body2', borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Icon icon="solar:pen-bold" width={20} height={20} />
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDeleteClick}
          sx={(theme) => ({
            typography: theme.typography.body2,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.error.main,
            '&:hover': {
              bgcolor: theme.palette.error.light,
              color: theme.palette.common.white
            }
          })}
        >
          <ListItemIcon
            sx={(theme) => ({
              minWidth: 28,
              color: theme.palette.error.main
            })}
          >
            <Icon icon="solar:trash-bin-trash-bold" width={20} height={20} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
