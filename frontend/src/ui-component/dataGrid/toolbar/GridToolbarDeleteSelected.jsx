import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DynamicModal from '../../modal/DynamicModal';
import { useTheme } from '@mui/material/styles';
import { usePermissions } from '../../../contexts/PermissionsContext';

const GridToolbarDeleteSelected = ({ selectionModel = [], onDeleteSelected, menuName = 'products' }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const { hasPermission } = usePermissions();

  const canDelete = hasPermission(menuName, 'can_delete');

  if (!selectionModel || selectionModel.length === 0) return null;

  const handleClick = () => {
    if (!canDelete) {
      setPermissionModalOpen(true);
      return;
    }
    setOpen(true);
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip
        title={canDelete ? 'Delete selected' : 'You do not have permission to delete'}
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.error.main,
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
        <span>
          <Button
            variant="text"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleClick}
            sx={{
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.common.white
              }
            }}
          >
            Delete ({selectionModel.length})
          </Button>
        </span>
      </Tooltip>

      <DynamicModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onDeleteSelected();
          setOpen(false);
        }}
        itemCount={selectionModel.length}
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
    </Box>
  );
};

GridToolbarDeleteSelected.propTypes = {
  selectionModel: PropTypes.array,
  onDeleteSelected: PropTypes.func.isRequired,
  menuName: PropTypes.string
};

export default GridToolbarDeleteSelected;
