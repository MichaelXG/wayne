import React from 'react';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import { List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse, { MenuItem as NavCollapseMenuItem } from '../NavCollapse';

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

export interface MenuItem extends Omit<NavCollapseMenuItem, 'type'> {
  type: 'group' | 'collapse' | 'item';
}

interface NavGroupProps {
  item: MenuItem;
  lastItem?: number;
  remItems?: MenuItem[];
  lastItemId?: string;
  setSelectedID: (id: string) => void;
  openMenuId?: string;
  onMenuClick?: (id: string) => void;
}

const NavGroup: React.FC<NavGroupProps> = ({
  item,
  lastItem,
  remItems,
  lastItemId,
  setSelectedID,
  openMenuId,
  onMenuClick
}) => {
  const theme = useTheme<ExtendedTheme>();

  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={menu.id}
            menu={menu as NavCollapseMenuItem}
            level={1}
            parentId={item.id}
            openMenuId={openMenuId}
            onMenuClick={onMenuClick}
            setSelectedID={setSelectedID}
          />
        );
      case 'item':
        return (
          <NavItem
            key={menu.id}
            item={menu}
            level={1}
            parentId={item.id}
            setSelectedID={setSelectedID}
          />
        );
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.menuCaption }}
              display="block"
              gutterBottom
            >
              {item.title}
              {item.caption && (
                <Typography
                  variant="caption"
                  sx={{ ...(theme.typography.subMenuCaption ?? {}) }}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {lastItem && lastItem > 0 && remItems && remItems.length > 0 && (
        <NavGroup
          item={remItems[0]}
          lastItem={lastItem - 1}
          remItems={remItems.slice(1)}
          lastItemId={lastItemId}
          setSelectedID={setSelectedID}
          openMenuId={openMenuId}
          onMenuClick={onMenuClick}
        />
      )}
    </>
  );
};

export default NavGroup; 