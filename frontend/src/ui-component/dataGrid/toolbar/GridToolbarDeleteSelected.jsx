import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DynamicModal from '../../modal/DynamicModal';

const GridToolbarDeleteSelected = ({ selectionModel = [], onDeleteSelected }) => {
  const [open, setOpen] = useState(false);

  if (!selectionModel || selectionModel.length === 0) return null;

  return (
    <Box display="flex" gap={1}>
      <Tooltip
        title="Delete selected"
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
        <span>
          {' '}
          {/* Necessário para Tooltip com botão desabilitado */}
          <Button variant="text" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => setOpen(true)}>
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
