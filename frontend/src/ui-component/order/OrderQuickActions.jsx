import React, { useRef, useState } from 'react';
import { Drawer, Fab, Grid, Button, Tooltip, IconButton, Badge, useTheme } from '@mui/material';
import { IconShoppingCart } from '@tabler/icons-react';
import Draggable from 'react-draggable';
import PerfectScrollbar from 'react-perfect-scrollbar';

import AnimateButton from 'ui-component/extended/AnimateButton';
import StoredOrder from './StoredOrder';

export default function OrderQuickActions({}) {
  const theme = useTheme();
  const nodeRef = useRef(null);
  const [open, setOpen] = useState(false);

  const storedOrder = JSON.parse(localStorage.getItem('order') || 'null');
  const orderItems = storedOrder?.items || [];

  const totalItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <>
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef}>
          <Tooltip
            title={'Order quick actions'}
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
            <Fab
              onClick={handleToggle}
              size="medium"
              color="secondary"
              aria-label="Order Quick Actions"
              sx={{
                borderRadius: 0,
                borderTopLeftRadius: '50%',
                borderBottomLeftRadius: '50%',
                borderTopRightRadius: '50%',
                borderBottomRightRadius: '4px',
                top: '30%',
                position: 'fixed',
                right: 10,
                zIndex: 1200,
                boxShadow: theme.customShadows.secondary
              }}
            >
              <AnimateButton type="scale">
                <IconButton color="inherit" size="large" disableRipple>
                  {totalItems > 0 && (
                    <Badge
                      badgeContent={totalItems}
                      sx={{
                        '& .MuiBadge-badge': {
                          bottom: 10,
                          left: 15,
                          backgroundColor: theme.palette.grey[900],
                          color: theme.palette.common.white
                        }
                      }}
                    >
                      <IconShoppingCart />
                    </Badge>
                  )}
                </IconButton>
              </AnimateButton>
            </Fab>
          </Tooltip>
        </div>
      </Draggable>

      <Drawer anchor="right" onClose={handleToggle} open={open} PaperProps={{ sx: { width: 740 } }}>
        <PerfectScrollbar>
          <StoredOrder />
        </PerfectScrollbar>
      </Drawer>
    </>
  );
}
