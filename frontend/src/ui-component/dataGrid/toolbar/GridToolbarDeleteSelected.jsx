import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DynamicModal from '../../modal/DynamicModal';
import { useTheme } from '@mui/material/styles';

const GridToolbarDeleteSelected = ({ selectionModel = [], onDeleteSelected }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  if (!selectionModel || selectionModel.length === 0) return null;

  return (
    <Box display="flex" gap={1}>
      <Tooltip
        title="Delete selected"
        placement="top"
        componentsProps={{
          tooltip: {
            sx: (theme) => ({
              backgroundColor: theme.palette.error.main,
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
        <span>
          {' '}
          {/* Necessário para Tooltip com botão desabilitado */}
          <Button
            variant="text"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: (theme) => theme.palette.error.light,
              color: (theme) => theme.palette.error.main,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.error.main,
                color: (theme) => theme.palette.common.white
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
    </Box>
  );
};

GridToolbarDeleteSelected.propTypes = {
  selectionModel: PropTypes.array,
  onDeleteSelected: PropTypes.func.isRequired
};

export default GridToolbarDeleteSelected;
