import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';

// project imports
import NavItem from '../NavItem';
import Transitions from 'ui-component/extended/Transitions';

import useConfig from 'hooks/useConfig';
import { useGetMenuMaster } from 'api/menu';

// third party

// assets
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function NavCollapse({ menu, level, parentId, openMenuId, onMenuClick }) {
  const theme = useTheme();
  const ref = useRef(null);

  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [selected, setSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickMini = (event) => {
    if (drawerOpen) {
      if (openMenuId === menu.id) {
        setSelected(null);
      } else {
        setSelected(menu.id);
      }
      onMenuClick(menu.id);
    } else {
      if (anchorEl === event?.currentTarget) {
        setAnchorEl(null);
        setSelected(null);
      } else {
        setAnchorEl(event?.currentTarget);
        setSelected(menu.id);
      }
    }
  };

  const openMini = Boolean(anchorEl);
  const isOpen = openMenuId === menu.id;

  const handleClosePopper = () => {
    setAnchorEl(null);
    if (!menu.url) {
      setSelected(null);
    }
  };

  useEffect(() => {
    if (openMenuId !== menu.id) {
      setSelected(null);
      setAnchorEl(null);
    }
  }, [openMenuId, menu.id]);

  const { pathname } = useLocation();

  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setSelected(id);
      }
    });
  };

  // menu collapse for sub-levels
  useEffect(() => {
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (item.link && !!matchPath({ path: item?.link, end: false }, pathname)) {
          setSelected(menu.id);
        }
        if (item.url === pathname) {
          setSelected(menu.id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);

  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    window.removeEventListener('resize', compareSize);
  }, []);

  useEffect(() => {
    if (menu.url === pathname) {
      setSelected(menu.id);
      onMenuClick(menu.id);
    }
  }, [pathname, menu, onMenuClick]);

  // menu collapse & item
  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return (
          <NavCollapse 
            key={item.id} 
            menu={item} 
            level={level + 1} 
            parentId={menu.id}
            openMenuId={openMenuId}
            onMenuClick={onMenuClick}
          />
        );
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} parentId={menu.id} />;
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

  const isSelected = selected === menu.id;
  const isParentSelected = parentId && openMenuId === parentId;

  const Icon = menu.icon;
  const menuIcon = menu.icon ? (
    <Icon strokeWidth={1.5} size={drawerOpen ? '20px' : '24px'} />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: isSelected ? 8 : 6,
        height: isSelected ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  const collapseIcon = drawerOpen ? (
    <IconChevronUp stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  ) : (
    <IconChevronRight stroke={1.5} size="16px" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  );

  const iconSelectedColor = theme.palette.grey[600];

  return (
    <>
      <ListItemButton
        disableRipple
        selected={isSelected}
        className={level > 1 ? 'submenu-items' : ''}
        onClick={handleClickMini}
        {...(!drawerOpen && {
          onMouseEnter: handleClickMini,
          onMouseLeave: handleClosePopper
        })}
        sx={(theme) => ({
          zIndex: 1201,
          borderRadius: `${borderRadius}px`,
          mb: 0.5,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          padding: !drawerOpen && level === 1 ? '12px 12px' : '8px 12px',
          minHeight: !drawerOpen && level === 1 ? '80px' : '38px',
          justifyContent: 'space-between',
          gap: 2,
          position: 'relative',

          ...(drawerOpen &&
            level !== 1 && {
              ml: `${level * 16}px`,
              pl: 2
            }),

          ...(!drawerOpen && {
            pl: level === 1 ? 0 : 1.25,
            '& .MuiListItemIcon-root': {
              minWidth: 'auto',
              width: 46,
              height: 46,
              borderRadius: `${borderRadius}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            },
            '& .menu-caption': {
              marginTop: '8px'
            },
            '& .menu-expand': {
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)'
            }
          }),

          ...(drawerOpen && {
            '&:hover': {
              bgcolor: theme.palette.grey[300],
              color: theme.palette.grey[500],
              '& .MuiListItemIcon-root': {
                color: theme.palette.grey[500]
              }
            },
            ...(isSelected && {
              bgcolor: theme.palette.grey[300],
              color: theme.palette.grey[500],
              '& .MuiListItemIcon-root': {
                color: theme.palette.grey[500]
              }
            })
          })
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: !drawerOpen && level === 1 ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: !drawerOpen && level === 1 ? 46 : 'auto'
          }}
        >
          <ButtonBase 
            aria-label="theme-icon" 
            sx={{ 
              borderRadius: `${borderRadius}px`,
              width: !drawerOpen && level === 1 ? '100%' : 'auto'
            }} 
            disableRipple={drawerOpen}
          >
            <ListItemIcon
              sx={(theme) => ({
                minWidth: level === 1 ? 36 : 18,
                color: isSelected ? theme.palette.grey[500] : theme.palette.text.primary,
                transition: 'color 0.2s ease-in-out',
                ...(!drawerOpen &&
                  level === 1 && {
                    borderRadius: `${borderRadius}px`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      bgcolor: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                    },
                    ...(isSelected && {
                      bgcolor: theme.palette.grey[300],
                      color: theme.palette.grey[500],
                      '&:hover': {
                        bgcolor: theme.palette.grey[300],
                        color: theme.palette.grey[500]
                      }
                    })
                  })
              })}
            >
              {menuIcon}
            </ListItemIcon>
          </ButtonBase>

          {!drawerOpen && level === 1 && (
            <Typography
              variant="caption"
              className="menu-caption"
              sx={{
                textAlign: 'center',
                fontSize: '0.625rem',
                lineHeight: 1.2,
                display: 'block',
                width: '100%',
                color: isSelected || (isParentSelected && level > 1) ? theme.palette.grey[900] : theme.palette.text.primary,
                fontWeight: isSelected || (isParentSelected && level > 1) ? 700 : 500,
                fontStyle: isSelected || (isParentSelected && level > 1) ? 'italic' : 'normal',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {menu.title}
            </Typography>
          )}
        </Box>

        {drawerOpen && (
          <Tooltip title={menu.title} disableHoverListener={!hoverStatus}>
            <ListItemText
              primary={
                <Typography
                  ref={ref}
                  noWrap
                  variant={isSelected ? 'h5' : 'body1'}
                  color="inherit"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: 102,
                    color: theme.palette.grey[900],
                    fontWeight: isSelected ? 700 : 500,
                    fontStyle: isSelected ? 'italic' : 'normal',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {menu.title}
                </Typography>
              }
              secondary={
                menu.caption && (
                  <Typography 
                    variant="caption" 
                    gutterBottom 
                    sx={{ 
                      display: 'block', 
                      ...theme.typography.subMenuCaption,
                      color: isSelected ? theme.palette.grey[900] : theme.palette.text.secondary,
                      fontWeight: isSelected ? 600 : 400,
                      fontStyle: isSelected ? 'italic' : 'normal',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {menu.caption}
                  </Typography>
                )
              }
            />
          </Tooltip>
        )}

        <Box className="menu-expand">
          {openMini || isOpen ? (
            <IconChevronUp 
              stroke={1.5} 
              size="16px" 
              style={{ 
                color: isSelected ? theme.palette.grey[500] : 'inherit',
                transition: 'color 0.2s ease-in-out'
              }} 
            />
          ) : (
            <IconChevronDown 
              stroke={1.5} 
              size="16px" 
              style={{ 
                color: isSelected ? theme.palette.grey[500] : 'inherit',
                transition: 'color 0.2s ease-in-out'
              }} 
            />
          )}
        </Box>

        {!drawerOpen && (
          <Popper
            open={openMini}
            anchorEl={anchorEl}
            placement="right-start"
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [-12, 0]
                }
              }
            ]}
            sx={{
              overflow: 'visible',
              zIndex: 2001,
              minWidth: 180,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 12,
                left: -5,
                width: 12,
                height: 12,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 120,
                borderLeft: '1px solid',
                borderBottom: '1px solid',
                borderColor: theme.palette.divider
              }
            }}
          >
            {({ TransitionProps }) => (
              <Transitions in={openMini} {...TransitionProps}>
                <Paper
                  sx={{
                    overflow: 'hidden',
                    mt: 1.5,
                    py: 0.5,
                    boxShadow: theme.shadows[8],
                    backgroundImage: 'none'
                  }}
                >
                  <ClickAwayListener onClickAway={handleClosePopper}>
                    <Box>{menus}</Box>
                  </ClickAwayListener>
                </Paper>
              </Transitions>
            )}
          </Popper>
        )}
      </ListItemButton>

      {drawerOpen && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={(theme) => ({
              position: 'relative',
              '& .MuiListItemButton-root': {
                pl: drawerOpen ? `${level * 16}px` : 2,
                py: 1,
                '&:before': drawerOpen && level > 1 && {
                  content: '""',
                  position: 'absolute',
                  left: `${(level - 1) * 16}px`,
                  top: 0,
                  width: '1px',
                  height: '100%',
                  backgroundColor: theme.palette.grey[300]
                }
              }
            })}
          >
            {menus}
          </List>
        </Collapse>
      )}
    </>
  );
}

NavCollapse.propTypes = { menu: PropTypes.any, level: PropTypes.number, parentId: PropTypes.string, openMenuId: PropTypes.string, onMenuClick: PropTypes.func };

