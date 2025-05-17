import { useState, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

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
                sx: {
                  backgroundColor: '#8E33FF',
                  color: '#fff',
                  fontSize: 12,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  boxShadow: 2
                }
              }
            }}
          >
            <Fab
              component="div"
              onClick={handleToggle}
              size="medium"
              variant="circular"
              color="secondary"
              sx={{
                borderRadius: 0,
                borderTopLeftRadius: '50%',
                borderBottomLeftRadius: '50%',
                borderTopRightRadius: '50%',
                borderBottomRightRadius: '4px',
                top: '20%',
                position: 'fixed',
                right: 10,
                zIndex: 1200,
                boxShadow: theme.customShadows.secondary
              }}
            >
              <AnimateButton type="rotate">
                <IconButton color="inherit" size="large" disableRipple aria-label="live customize">
                  <IconSettings />
                </IconButton>
              </AnimateButton>
            </Fab>
          </Tooltip>
        </div>
      </Draggable>
      <Drawer anchor="right" onClose={handleToggle} open={open} PaperProps={{ sx: { width: 280 } }}>
        <PerfectScrollbar>
          <Grid container spacing={2}>
            <Grid size={12}>
              {/* font family */}
              <FontFamily />
              <Divider />
            </Grid>
            <Grid size={12}>
              {/* border radius */}
              <BorderRadius />
              <Divider />
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
}
