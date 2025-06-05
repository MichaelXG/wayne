import { useState, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import FontFamily from './FontFamily';
import BorderRadius from './BorderRadius';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { IconSettings } from '@tabler/icons-react';
import Draggable from 'react-draggable';

// ==============================|| LIVE CUSTOMIZATION ||============================== //

export default function Customization() {
  const theme = useTheme();
  const nodeRef = useRef(null);

  // drawer on/off
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef}>
          <Tooltip
            title="Live Customize"
            placement="top"
            componentsProps={{
              tooltip: {
                sx: (theme) => ({
                  backgroundColor: theme.palette.grey[700],
                  color: theme.palette.common.white,
                  fontSize: 12,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  boxShadow: theme.shadows[3],
                  '& .MuiTooltip-arrow': {
                    color: theme.palette.grey[700]
                  }
                })
              }
            }}
            arrow
          >
            <Fab
              component="div"
              onClick={handleToggle}
              size="medium"
              variant="circular"
              sx={{
                position: 'fixed',
                top: '15%',
                right: 10,
                zIndex: 1200,
                borderRadius: '50%',
                bgcolor: theme.palette.grey[200],
                color: theme.palette.grey[700],
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  bgcolor: theme.palette.grey[700],
                  color: theme.palette.common.white,
                  transform: 'scale(1.1)'
                },
                boxShadow: theme.shadows[2]
              }}
            >
              <AnimateButton type="rotate">
                <IconButton
                  color="inherit"
                  size="large"
                  disableRipple
                  aria-label="live customize"
                >
                  <IconSettings />
                </IconButton>
              </AnimateButton>
            </Fab>
          </Tooltip>
        </div>
      </Draggable>

      <Drawer
        anchor="right"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 320,
            background: theme.palette.background.paper,
            p: 2,
            boxShadow: theme.shadows[8]
          }
        }}
        variant="temporary"
      >
        <PerfectScrollbar>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" color="grey.700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconSettings size={24} />
              Live Customize
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Customize your interface with these options
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid size={12}>
              <FontFamily />
            </Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2.5 }} />
            </Grid>

            <Grid size={12}>
              <BorderRadius />
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
}
