import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';

// material-ui
import { Snackbar, Alert, Slide, Typography, Chip, Box, Stack, Avatar } from '@mui/material';
import { IconMailbox } from '@tabler/icons-react';

export default function NotificationList({ csc }) {
  const theme = useTheme();
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
          <Typography
            variant="body2"
            sx={(theme) => ({
              color: theme.palette.text.secondary
            })}
          >
            Your verification code is:
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h5"
              sx={(theme) => ({
                color: theme.palette.grey[600]
              })}
            >
              {csc}
            </Typography>
            <Chip
              label="NEW"
              size="small"
              sx={(theme) => ({
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.warning.contrastText,
                fontWeight: 600,
                px: 1
              })}
            />
          </Box>
        </Stack>
      </Alert>
    </Snackbar>
  );
}

NotificationList.propTypes = {
  csc: PropTypes.string
};
