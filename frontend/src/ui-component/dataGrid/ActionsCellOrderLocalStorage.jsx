import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, Typography, Link, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon } from '@iconify/react';
import { BaseDir } from '../../App';

const ActionsCellOrderLocalStorage = ({ params, onDelete, onDeleteItem, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDelete = () => {
    handleCloseMenu();
    if (onDeleteItem) onDeleteItem(params.row.id); // ✅ usa o product_id corretamente
  };

  const handleEdit = () => {
    handleCloseMenu();
    if (onEdit) onEdit(params.row); // ✅ passa o item completo para o modal
  };

  return (
    <>
      <Tooltip
        title="Actions"
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#8E33FF', // fundo
              color: '#fff', // texto
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
        <MenuItem
          component={Link}
          href={`${BaseDir}/products/detail/${params.row.product_id}`} // ✅ usa o product_id
          sx={{ typography: 'body2', borderRadius: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Icon icon="solar:eye-bold" width={20} height={20} />
          </ListItemIcon>
          View
        </MenuItem>

        <MenuItem onClick={handleEdit} sx={{ typography: 'body2', borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Icon icon="solar:pen-bold" width={20} height={20} />
          </ListItemIcon>
          Edit
        </MenuItem>

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

export default ActionsCellOrderLocalStorage;
