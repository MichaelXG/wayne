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
import { TreeItemContent, TreeItemRoot, TreeItemGroupTransition, TreeItemIconContainer, TreeItemLabel } from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { usePermissionsGroups } from '../../contexts/PermissionsGroupsContext';
import useLocalStorage from '../../hooks/useLocalStorage';

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

function StatusLegend() {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2">Legend</Typography>
        {Object.keys(STATUS_ICONS).map((key) => (
          <Stack direction="row" spacing={1} alignItems="center" key={key}>
            {STATUS_ICONS[key]}
            <Typography variant="body2">{key}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

const PermissionTreeItem = React.forwardRef(function PermissionTreeItem({ item, togglePermission }, ref) {
  const { getContextProviderProps, getRootProps, getContentProps, getLabelProps, getGroupTransitionProps, getIconContainerProps, status } =
    useTreeItem({ ...item, rootRef: ref });

  const isPermission = item.groupId !== undefined;

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <TreeItemLabel {...getLabelProps()} />

          {isPermission && (
            <Stack spacing={1} sx={{ mt: 1, ml: 3 }}>
              {['can_read', 'can_create', 'can_update', 'can_delete'].map((perm) => (
                <Stack key={perm} direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption">{perm.replace('can_', '').toUpperCase()}</Typography>
                  <Switch size="small" checked={item[perm]} onChange={() => togglePermission(item.groupId, item.menu_name, perm)} />
                </Stack>
              ))}
            </Stack>
          )}
        </TreeItemContent>

        {item.children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function PermissionsTreeView() {
  const { groups, setGroups, loadGroups } = usePermissionsGroups();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const [loaded, setLoaded] = useState(false);

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

  const treeItems = groups.map((group) => ({
    id: `group-${group.id}`,
    itemId: `group-${group.id}`,
    label: group.name,
    children: group.permissions.map((perm) => ({
      ...perm,
      id: `perm-${group.id}-${perm.menu_name}`,
      itemId: `perm-${group.id}-${perm.menu_name}`,
      label: perm.menu_name,
      groupId: group.id,
      disabled: false,
      editable: false
    }))
  }));

  return (
    <Stack spacing={6} direction={{ md: 'row', xs: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 200, minWidth: 350 }}>
        <RichTreeView
          items={treeItems}
          defaultExpandedItems={treeItems.map((g) => g.id)}
          slots={{
            item: (props) => <PermissionTreeItem {...props} item={props} togglePermission={handleToggle} />
          }}
          isItemDisabled={(item) => Boolean(item?.disabled)}
          isItemEditable={(item) => Boolean(item?.editable)}
        />
      </Box>
      <Box sx={{ flex: '0 0 auto', minWidth: 200 }}>
        <StatusLegend />
      </Box>
    </Stack>
  );
}
