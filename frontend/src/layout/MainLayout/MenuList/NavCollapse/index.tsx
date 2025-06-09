import React, { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
  ClickAwayListener,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
  Box
} from '@mui/material';

// project imports
import NavItem from '../NavItem';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import { useGetMenuMaster } from 'api/menu';

// assets
import { IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface ExtendedTheme extends Theme {
  typography: Theme['typography'] & {
    menuCaption?: {
      fontSize?: string;
      fontWeight?: number;
      color?: string;
      [key: string]: any;
    };
    subMenuCaption?: {
      fontSize?: string;
      fontWeight?: number;
      color?: string;
      [key: string]: any;
    };
  };
}

export interface MenuItem {
  id: string;
  title: string;
  caption?: string;
  type: 'collapse' | 'item';
  url?: string;
  link?: string;
  icon?: React.ElementType;
  children?: MenuItem[];
  elements?: MenuItem[];
  external?: boolean;
  disabled?: boolean;
  chip?: {
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    variant: 'filled' | 'outlined';
    size: 'small' | 'medium';
    label: string;
    avatar?: React.ReactElement;
  };
}

export interface NavCollapseProps {
  menu: MenuItem;
  level: number;
  parentId: string;
  openMenuId?: string;
  onMenuClick?: (id: string) => void;
  setSelectedID: (id: string) => void;
}

const NavCollapse: React.FC<NavCollapseProps> = ({
  menu,
  level,
  openMenuId,
  onMenuClick,
  setSelectedID
}) => {
  const theme = useTheme<ExtendedTheme>();
  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;
  const { pathname } = useLocation();

  const [selected, setSelected] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClickMini = (event: React.MouseEvent<HTMLElement>) => {
    if (drawerOpen) {
      if (openMenuId === menu.id) {
        setSelected(false);
      } else {
        setSelected(true);
      }
      onMenuClick?.(menu.id);
    } else {
      if (anchorEl === event?.currentTarget) {
        setAnchorEl(null);
        setSelected(false);
      } else {
        setAnchorEl(event?.currentTarget);
        setSelected(true);
      }
    }
  };

  const openMini = Boolean(anchorEl);
  const isOpen = openMenuId === menu.id;

  const handleClosePopper = () => {
    setAnchorEl(null);
    if (!menu.url) {
      setSelected(false);
    }
  };

  useEffect(() => {
    if (openMenuId !== menu.id) {
      setSelected(false);
      setAnchorEl(null);
    } else {
      setSelected(true);
    }
  }, [openMenuId, menu.id]);

  const checkOpenForParent = (child: MenuItem[]) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setSelected(true);
      }
    });
  };

  useEffect(() => {
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.children?.length) {
          checkOpenForParent(item.children);
        }
        if (item.link && matchPath({ path: item?.link, end: false }, pathname)) {
          setSelected(true);
        }
        if (item.url === pathname) {
          setSelected(true);
        }
      });
    }
  }, [pathname, menu.children]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        ref.current.scrollWidth > ref.current.clientWidth;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (menu.url === pathname) {
      setSelected(true);
      onMenuClick?.(menu.id);
    }
  }, [pathname, menu, onMenuClick]);

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
            setSelectedID={setSelectedID}
          />
        );
      case 'item':
        return (
          <NavItem
            key={item.id}
            item={item}
            level={level + 1}
            parentId={menu.id}
            setSelectedID={setSelectedID}
          />
        );
      default:
        return (
          <Typography
            key={item.id}
            variant="h6"
            align="center"
            sx={{ color: theme.palette.error.main }}
          >
            Menu Items Error
          </Typography>
        );
    }
  });

  const isSelected = selected;

  const menuIcon = menu.icon ? (
    <menu.icon strokeWidth={1.5} size={drawerOpen ? '24px' : '22px'} />
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
        sx={{
          padding: !drawerOpen && level === 1 ? 'null 8px 4px 6px' : '4px 8px 4px 12px',
          minHeight: !drawerOpen && level === 1 ? '58px' : '38px',
          gap: 1,
          zIndex: 1201,
          borderRadius: `${borderRadius}px`,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
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
              width: '100%',
              height: '100%',
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
          })
        }}
      >
        <ListItemIcon>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={isSelected ? 'subtitle1' : 'body1'}
              color="inherit"
              sx={{ my: 'auto' }}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography
                variant="caption"
                sx={{ ...(theme.typography.subMenuCaption ?? {}) }}
                display="block"
                gutterBottom
              >
                {menu.caption}
              </Typography>
            )
          }
        />
        {collapseIcon}
      </ListItemButton>

      {drawerOpen ? (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{
              position: 'relative',
              '&:after': {
                content: "''",
                position: 'absolute',
                left: '32px',
                top: 0,
                height: '100%',
                width: '1px',
                opacity: 1,
                background: theme.palette.primary.light
              }
            }}
          >
            {menus}
          </List>
        </Collapse>
      ) : (
        <Popper
          open={openMini}
          anchorEl={anchorEl}
          placement="right-start"
          style={{
            zIndex: 2001
          }}
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [-12, 1]
                }
              }
            ]
          }}
        >
          {({ TransitionProps }) => (
            <Transitions in={openMini} {...TransitionProps}>
              <Paper
                sx={{
                  overflow: 'hidden',
                  mt: 1.5,
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
    </>
  );
};

export default NavCollapse; 