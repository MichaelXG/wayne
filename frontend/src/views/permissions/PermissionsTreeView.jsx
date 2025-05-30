import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import AdjustIcon from '@mui/icons-material/Adjust';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { TreeItemContent, TreeItemRoot, TreeItemGroupTransition, TreeItemIconContainer } from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';

import { usePermissionsGroups } from '../../contexts/PermissionsGroupsContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { IconShieldCheck, IconShieldX } from '@tabler/icons-react';
import { Grid, Tooltip, useTheme } from '@mui/material';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import MainCard from '../../ui-component/cards/MainCard';
import { gridSpacing } from '../../store/constant';

const STATUS_ICONS = {
  focused: <AdjustIcon color="primary" fontSize="small" />,
  selected: <CheckCircleOutlinedIcon color="success" fontSize="small" />,
  expandable: <ExpandCircleDownOutlinedIcon color="secondary" fontSize="small" />,
  expanded: <ExpandCircleDownRoundedIcon color="secondary" fontSize="small" />,
  disabled: <CancelOutlinedIcon color="action" fontSize="small" />,
  editable: <EditOutlinedIcon color="warning" fontSize="small" />,
  editing: <DrawOutlinedIcon color="info" fontSize="small" />,
  loading: <HourglassBottomOutlinedIcon color="info" fontSize="small" />,
  error: <ErrorOutlineOutlinedIcon color="info" fontSize="small" />
};

const mapPermissionToTreeItem = (groupId, perm) => ({
  id: `perm-${groupId}-${perm.menu_name}`,
  itemId: `perm-${groupId}-${perm.menu_name}`,
  label: perm.menu_name,
  type: 'menu',
  groupId,
  children: ['can_read', 'can_create', 'can_update', 'can_delete', 'can_secret'].map((key) => ({
    id: `perm-${groupId}-${perm.menu_name}-${key}`,
    itemId: `perm-${groupId}-${perm.menu_name}-${key}`,
    label: key.replace('can_', '').toUpperCase(),
    type: 'permission',
    permissionKey: key,
    checked: perm[key],
    groupId,
    menuName: perm.menu_name
  }))
});

const mapGroupToTreeItem = (group) => ({
  id: `group-${group.id}`,
  itemId: `group-${group.id}`,
  label: group.name,
  type: 'group',
  children: group.permissions.map((perm) => mapPermissionToTreeItem(group.id, perm))
});

function StatusLegend() {
  const theme = useTheme();

  return (
    <Paper
      variant="outlined"
      elevation={2}
      sx={{
        padding: 2,
        background: theme.palette.grey[50],
        ...(theme.palette.mode === 'dark' && {
          background: theme.palette.grey[900]
        })
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2">Legend</Typography>
        {Object.entries(STATUS_ICONS).map(([key, icon]) => (
          <Stack key={key} direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="body2">{key}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

const getPermissionItemStyles = (theme, { isGroup = false, isPermission = false, status = {} } = {}) => {
  const base = {
    px: 1.5,
    py: 0.5,
    borderRadius: theme.shape.borderRadius,
    textTransform: 'capitalize'
  };

  if (isGroup) {
    base.fontWeight = 'bold';
    base.backgroundColor = theme.palette.grey[700];
    base.color = theme.palette.common.white;
  }

  if (isPermission) {
    base.fontStyle = 'italic';
    base.pl = 3;
  }

  return base;
};

const PermissionTreeItem = React.forwardRef(function PermissionTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, groupId, menu_name, type, togglePermission, ...rest } = props;
  const { getContextProviderProps, getRootProps, getContentProps, getLabelProps, getGroupTransitionProps, getIconContainerProps, status } =
    useTreeItem({ id, itemId, label, disabled, children, rootRef: ref });
  const theme = useTheme();
  const isGroup = type === 'group';
  const isPermission = type === 'menu';

  if (type === 'permission') {
    return (
      <TreeItemProvider {...getContextProviderProps()}>
        <TreeItemRoot {...getRootProps()}>
          <TreeItemContent {...getContentProps()} sx={getPermissionItemStyles(theme, { isPermission: true })}>
            <TreeItemIconContainer {...getIconContainerProps()}>
              <TreeItemIcon status={status} />
            </TreeItemIconContainer>
            <Box {...getLabelProps()}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption">{label}</Typography>
                <Switch size="small" checked={props.checked} onChange={() => togglePermission(groupId, menu_name, props.permissionKey)} />
              </Stack>
            </Box>
          </TreeItemContent>
        </TreeItemRoot>
      </TreeItemProvider>
    );
  }

  const styleProps = { isGroup, isPermission, status };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()} sx={getPermissionItemStyles(theme, styleProps)}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <Box {...getLabelProps()}>
            <Typography variant="body2" sx={{ color: 'inherit' }}>
              {label}
            </Typography>
          </Box>
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function PermissionsTreeView() {
  const { groups, setGroups, loadGroups } = usePermissionsGroups();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  const checkingAuth = useAuthGuard();

  const authIcon = !checkingAuth ? (
    <Tooltip title="User authenticated">
      <IconShieldCheck color={theme.palette.success.main} size={20} />
    </Tooltip>
  ) : (
    <Tooltip title="Authentication failed">
      <IconShieldX color={theme.palette.error.main} size={20} />
    </Tooltip>
  );

  useEffect(() => {
    if (!loaded && userData?.authToken) {
      loadGroups(userData.authToken);
      setLoaded(true);
    }
  }, [loaded, userData, loadGroups]);

  const handleToggle = (groupId, menuName, permKey) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? {
              ...group,
              permissions: group.permissions.map((perm) => (perm.menu_name === menuName ? { ...perm, [permKey]: !perm[permKey] } : perm))
            }
          : group
      )
    );
  };

  const treeItems = groups.map(mapGroupToTreeItem);

  return (
    <MainCard title="Permissions Groups" secondary={authIcon}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Stack spacing={6} direction={{ md: 'row', xs: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 200, minWidth: 350 }}>
              <RichTreeView
                items={treeItems}
                defaultExpandedItems={treeItems.map((g) => g.id)}
                slots={{
                  item: (props) => <PermissionTreeItem {...props} togglePermission={handleToggle} />
                }}
                isItemDisabled={(item) => Boolean(item?.disabled)}
                isItemEditable={(item) => Boolean(item?.editable)}
              />
            </Box>
            <Box sx={{ flex: '0 0 auto', minWidth: 200 }}>
              <StatusLegend />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
PermissionsTreeView.displayName = 'PermissionsTreeView';
