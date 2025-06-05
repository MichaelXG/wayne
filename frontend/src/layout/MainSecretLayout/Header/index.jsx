import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[4],
  [theme.breakpoints.up('md')]: {
    paddingRight: '16px',
    paddingLeft: '16px'
  }
}));

const MenuButton = styled(Button)(({ theme, active }) => ({
  margin: theme.spacing(0, 1),
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/secret' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/secret/inventory' },
    { text: 'Security', icon: <SecurityIcon />, path: '/secret/security' },
    { text: 'Wanted', icon: <PersonIcon />, path: '/secret/wanted' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <HeaderWrapper position="sticky">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Wayne Enterprises
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <MenuButton
              key={item.text}
              startIcon={item.icon}
              active={location.pathname === item.path ? 1 : 0}
              onClick={() => navigate(item.path)}
            >
              {item.text}
            </MenuButton>
          ))}
        </Box>
      </Toolbar>
    </HeaderWrapper>
  );
};

export default Header; 