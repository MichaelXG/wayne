import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';

import Typography from '@mui/material/Typography';

// project imports
import NavCollapse from '../NavCollapse';
import NavItem from '../NavItem';

import { useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

export default function NavGroup({ item, lastItem, remItems, lastItemId, setSelectedID, openMenuId, onMenuClick }) {
  const theme = useTheme();
  const { pathname } = useLocation();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentItem, setCurrentItem] = useState(item);

  const openMini = Boolean(anchorEl);

  useEffect(() => {
    if (lastItem) {
      if (item.id === lastItemId) {
        const localItem = { ...item };
        const elements = remItems.map((ele) => ele.elements);
        localItem.children = elements.flat(1);
        setCurrentItem(localItem);
      } else {
        setCurrentItem(item);
      }
    }
  }, [item, lastItem, remItems, lastItemId]);

  const checkOpenForParent = (child, id) => {
    child.forEach((ele) => {
      if (ele.children?.length) {
        checkOpenForParent(ele.children, currentItem.id);
      }
      if (ele?.url && !!matchPath({ path: ele?.link ? ele.link : ele.url, end: true }, pathname)) {
        setSelectedID(id);
      }
    });
  };

  const checkSelectedOnload = (data) => {
    const childrens = data.children ? data.children : [];
    childrens.forEach((itemCheck) => {
      if (itemCheck?.children?.length) {
        checkOpenForParent(itemCheck.children, currentItem.id);
      }
      if (itemCheck?.url && !!matchPath({ path: itemCheck?.link ? itemCheck.link : itemCheck.url, end: true }, pathname)) {
        setSelectedID(currentItem.id);
      }
    });

    if (data?.url && !!matchPath({ path: data?.link ? data.link : data.url, end: true }, pathname)) {
      setSelectedID(currentItem.id);
    }
  };

  // keep selected-menu on page load and use for horizontal menu close on change routes
  useEffect(() => {
    checkSelectedOnload(currentItem);
    if (openMini) setAnchorEl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentItem]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // menu list collapse & items
  const items = currentItem.children?.map((menu) => {
    switch (menu?.type) {
      case 'collapse':
        return (
          <NavCollapse 
            key={menu.id} 
            menu={menu} 
            level={1} 
            parentId={currentItem.id}
            openMenuId={openMenuId}
            onMenuClick={onMenuClick}
          />
        );
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} openMenuId={openMenuId} />;
      default:
        return (
          <Typography
            key={menu?.id}
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

  return (
    <>
      <List
        disablePadding={!drawerOpen}
        subheader={
          currentItem.title &&
          drawerOpen && (
            <Typography 
              variant="caption" 
              gutterBottom 
              sx={(theme) => ({
                display: 'block',
                ...theme.typography.menuCaption,
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                color: theme.palette.grey[600],
                padding: '5px 15px 5px',
                marginBottom: '10px',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                '&:hover': {
                  color: theme.palette.grey[800]
                }
              })}
            >
              {currentItem.title}
              {currentItem.caption && (
                <Typography 
                  variant="caption" 
                  gutterBottom 
                  sx={(theme) => ({ 
                    display: 'block',
                    ...theme.typography.subMenuCaption,
                    color: theme.palette.grey[500],
                    fontSize: '0.75rem'
                  })}
                >
                  {currentItem.caption}
                </Typography>
              )}
            </Typography>
          )
        }
        sx={(theme) => ({
          '& > .MuiListItemButton-root': {
            pl: 2
          },
          '& .submenu-items': {
            position: 'relative',
            pl: 2,
            '&:before': drawerOpen && {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              width: '16px',
              height: '1px',
              backgroundColor: theme.palette.grey[300],
              transform: 'translateY(-50%)'
            },
            '&:after': drawerOpen && {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '1px',
              height: 'calc(100% + 8px)',
              backgroundColor: theme.palette.grey[300],
              transform: 'translateY(-4px)'
            },
            '&:last-child:after': {
              height: '50%'
            },
            '&:first-of-type:after': {
              top: '50%',
              height: 'calc(50% + 4px)'
            }
          }
        })}
      >
        {items}
      </List>

      {/* group divider */}
      {drawerOpen && <Divider sx={{ mt: 0.25, mb: 1.25 }} />}
    </>
  );
}

NavGroup.propTypes = {
  item: PropTypes.any,
  lastItem: PropTypes.number,
  remItems: PropTypes.array,
  lastItemId: PropTypes.string,
  selectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.string]),
  setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func]),
  openMenuId: PropTypes.string,
  onMenuClick: PropTypes.func
};
