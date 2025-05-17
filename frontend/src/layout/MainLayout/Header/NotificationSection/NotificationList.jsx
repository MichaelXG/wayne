import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Snackbar, Alert, Slide, Typography, Chip, Box, Stack, Avatar } from '@mui/material';
import { IconMailbox } from '@tabler/icons-react';

export default function NotificationList({ csc }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (csc) setOpen(true);
  }, [csc]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={Slide}
    >
      <Alert onClose={handleClose} severity="info" icon={<IconMailbox size={20} />} sx={{ alignItems: 'flex-start', width: 350 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">Security Code Sent</Typography>
          <Typography variant="body2" color="text.secondary">
            Your verification code is:
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" color="secondary">
              {csc}
            </Typography>
            <Chip label="NEW" color="warning" size="small" />
          </Box>
        </Stack>
      </Alert>
    </Snackbar>
  );
}

NotificationList.propTypes = {
  csc: PropTypes.string
};
