import { memo, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import menuItems from 'menu-items';

import { useGetMenuMaster } from 'api/menu';
import { useTheme } from '@mui/material/styles';
import { usePermissions } from '../../../contexts/PermissionsContext';
import { filterMenuItems } from '../../../utils/permissions';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { permissions: userPermissions } = usePermissions();

  const [selectedID, setSelectedID] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuClick = (menuId) => {
    setOpenMenuId(menuId === openMenuId ? null : menuId);
  };

  const lastItem = null;

  // ✅ Aplica o filtro baseado nas permissões
  const filteredMenuItems = filterMenuItems(menuItems.items, userPermissions);

  let lastItemIndex = filteredMenuItems.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < filteredMenuItems.length) {
    lastItemId = filteredMenuItems[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = filteredMenuItems.slice(lastItem - 1, filteredMenuItems.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navItems = filteredMenuItems.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem 
                item={item} 
                level={1} 
                isParents 
                setSelectedID={() => setSelectedID('')} 
              />
              {index !== 0 && <Divider sx={{ py: 0.5 }} />}
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            openMenuId={openMenuId}
            onMenuClick={handleMenuClick}
          />
        );
      default:
        return (
          <Typography
            key={item.id}
            variant="h6"
            align="center"
            sx={(theme) => ({
              color: theme.palette.error.main
            })}
          >
            {' '}
            Menu Items Error
          </Typography>
        );
    }
  });

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>;
}

export default memo(MenuList);
