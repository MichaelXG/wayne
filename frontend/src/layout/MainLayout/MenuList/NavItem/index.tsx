import { forwardRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip
} from '@mui/material';

// project imports
import { useGetMenuMaster } from 'api/menu';
import { NavItemProps } from './types';

// assets
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

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(({ item, level, setSelectedID }, ref) => {
  const theme = useTheme<ExtendedTheme>();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;

  const [selected, setSelected] = useState<boolean>(false);

  const Icon = item.icon;
  const itemIcon = Icon ? (
    <Icon style={{ fontSize: drawerOpen ? '24px' : '22px' }} />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected ? 8 : 6,
        height: selected ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  const itemHandler = () => {
    setSelected(true);
    setSelectedID(item.id);
  };

  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      setSelected(true);
    }
  }, [item.id]);

  const listItemProps: {
    component: typeof Link | 'a';
    href?: string;
    target?: string;
    to?: string;
  } = {
    component: item.external ? 'a' : Link,
    ...(item.external && { href: item.url }),
    ...(item.external && item.target && { target: item.target }),
    ...(!item.external && { to: item.url || '' })
  };

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={itemHandler}
      selected={selected}
      ref={ref}
      sx={{
        pl: drawerOpen ? `${level * 16}px` : 1.25,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: theme.palette.primary.light
          },
          '&.Mui-selected': {
            bgcolor: theme.palette.primary.light,
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            '&:hover': {
              color: theme.palette.primary.main,
              bgcolor: theme.palette.primary.light
            }
          }
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: 'transparent'
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent'
            },
            bgcolor: 'transparent'
          }
        })
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: !drawerOpen ? 36 : 'auto',
          color: selected ? theme.palette.primary.main : theme.palette.text.primary,
          ...(!drawerOpen && {
            borderRadius: 1.5,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              bgcolor: theme.palette.secondary.light
            }
          }),
          ...(!drawerOpen &&
            selected && {
              bgcolor: theme.palette.secondary.light,
              '&:hover': {
                bgcolor: theme.palette.secondary.light
              }
            })
        }}
      >
        {itemIcon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={selected ? 'subtitle1' : 'body1'}
            color="inherit"
            sx={{ my: 'auto' }}
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.subMenuCaption }}
              display="block"
              gutterBottom
            >
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar}
        />
      )}
    </ListItemButton>
  );
});

NavItem.displayName = 'NavItem';

export type { NavItemProps };
export default NavItem; 