import React from 'react';
import { Dialog, DialogActions, Button, Typography, Box, IconButton, Divider, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const iconMap = {
  success: { icon: <CheckCircleIcon fontSize="large" color="success" />, color: 'success.main' },
  error: { icon: <WarningAmberIcon fontSize="large" color="error" />, color: 'error.main' },
  warning: { icon: <WarningAmberIcon fontSize="large" color="warning" />, color: 'warning.main' },
  info: { icon: <InfoIcon fontSize="large" color="info" />, color: 'info.main' }
};

const DynamicModal = ({
  open,
  onClose,
  onSubmit,
  onConfirm,
  itemCount = 0,
  type = 'error', // success | error | warning | info
  mode = 'delete', // delete | confirm | custom
  title,
  description,
  submitLabel = 'Confirm',
  cancelLabel = 'Cancel'
}) => {
  const isSubmitMode = typeof onSubmit === 'function';
  const { icon, color } = iconMap[type] || iconMap.error;

  const renderConfirmLabel = () => {
    if (mode === 'custom' || mode === 'confirm') return submitLabel;
    if (mode === 'delete') return `Delete ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
    return submitLabel;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'visible',
          position: 'relative',
          mt: 4
        }
      }}
    >
      {/* Top bar color */}
      <Box
        sx={{
          position: 'absolute',
          top: -4,
          left: 0,
          width: '100%',
          height: 4,
          bgcolor: (theme) => theme.palette[type]?.main || theme.palette.error.main,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      />

      {/* Close button */}
      <Tooltip
        title={'Close'}
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: (theme) => theme.palette[type]?.main,
              color: (theme) => theme.palette.common.white,
              fontSize: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              boxShadow: 2
            }
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => {
            document.activeElement?.blur();
            onClose?.();
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette[type]?.main || theme.palette.grey[500],
            border: 'none',
            '&:hover': {
              backgroundColor: theme.palette[type]?.light || theme.palette.error.light,
              color: theme.palette[type]?.main || theme.palette.grey[500]
            }
          })}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>

      {/* Modal content */}
      <Box textAlign="center" mt={6}>
        {icon}
        <Typography variant="h5" mt={1}>
          {title || (type === 'success' ? 'Success!' : 'Are you sure?')}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1} mb={2} px={2}>
          {description ||
            (mode === 'confirm'
              ? 'Do you really want to proceed?'
              : `Do you really want to remove ${itemCount} ${itemCount === 1 ? 'item' : 'items'}?`)}
        </Typography>
      </Box>

      <Divider />

      {/* Action buttons */}
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button
          fullWidth
          onClick={onClose}
          variant="outlined"
          sx={(theme) => ({
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.main,
            border: 'none',
            '&:hover': {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.light
            }
          })}
        >
          {cancelLabel}
        </Button>

        <Button
          fullWidth
          onClick={isSubmitMode ? onSubmit : onConfirm}
          variant="contained"
          sx={(theme) => ({
            backgroundColor: theme.palette[type]?.light || theme.palette.error.light,
            color: theme.palette[type]?.main || '#fff',
            '&:hover': {
              backgroundColor: theme.palette[type]?.main || theme.palette.error.main,
              color: theme.palette[type]?.light || '#fff'
            }
          })}
        >
          {renderConfirmLabel()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicModal;
