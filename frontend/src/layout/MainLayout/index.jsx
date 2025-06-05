import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContentStyled from './MainContentStyled';
import Customization from '../Customization';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import OrderQuickActions from '../../ui-component/order/OrderQuickActions';
import { PermissionsProvider } from '../../contexts/PermissionsContext';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { borderRadius, miniDrawer } = useConfig();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  const [hasOrder, setHasOrder] = useState(false);

  // Atualiza dinamicamente se existe uma ordem
  useEffect(() => {
    const checkOrder = () => {
      try {
        const order = JSON.parse(localStorage.getItem('order') || 'null');
        const exists = order && Array.isArray(order.items) && order.items.length > 0;
        setHasOrder(exists);
      } catch {
        setHasOrder(false);
      }
    };

    checkOrder(); // chamada imediata
    const interval = setInterval(checkOrder, 1000); // checa a cada 1s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handlerDrawerOpen(!miniDrawer);
  }, [miniDrawer]);

  useEffect(() => {
    if (downMD) handlerDrawerOpen(false);
  }, [downMD]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={(theme) => ({
          bgcolor: theme.palette.background.default
        })}
      >
        <Toolbar sx={{ p: 2 }}>
          <Header />
        </Toolbar>
      </AppBar>

      {/* menu / drawer */}
      <Sidebar />

      {/* main content */}
      <MainContentStyled {...{ borderRadius, open: drawerOpen }}>
        <Box sx={{ px: { xs: 0 }, minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}>
          <Breadcrumbs />
          <Outlet />
          <Footer />
        </Box>
      </MainContentStyled>

      <Customization />

      {/* ✅ Aparece automaticamente conforme ordem existir */}
      {hasOrder && (
        <OrderQuickActions
          onFilterChange={(status) => {
            console.log('Status changed:', status);
          }}
          onCreateClick={() => {
            navigate('/orders/create');
          }}
        />
      )}
    </Box>
  );
}
