import * as React from 'react';
import { useEffect } from 'react';
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

import { usePermissions } from '../../contexts/PermissionsContext';

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
    <Paper variant="outlined" elevation={2} sx={{ p: 2 }}>
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

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <TreeItemLabel {...getLabelProps()} />

          <Stack direction="row">
            {Object.keys(STATUS_ICONS).map((iconKey, index) => (
              status[iconKey] && (
                <Box key={index} sx={{ display: 'flex' }}>
                  {STATUS_ICONS[iconKey]}
                </Box>
              )
            ))}
          </Stack>

          {/* Stack com switches */}
          <Stack spacing={1} sx={{ mt: 1, ml: 3 }}>
            {['can_read', 'can_create', 'can_update', 'can_delete'].map((perm) => (
              <Stack key={perm} direction="row" spacing={1} alignItems="center">
                <Typography variant="caption">{perm.replace('can_', '').toUpperCase()}</Typography>
                <Switch
                  size="small"
                  checked={item[perm]}
                  onChange={() => togglePermission(item.id, perm)}
                />
              </Stack>
            ))}
          </Stack>
        </TreeItemContent>

        {item.children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function PermissionsTreeView() {
  const { permissions, setPermissions } = usePermissions();

  const permissionsWithIds = permissions.map((perm) => ({
    ...perm,
    id: perm.menu_name,
    itemId: perm.menu_name,
    label: perm.menu_name,
    disabled: false,
    editable: false
  }));

  useEffect(() => {
    console.log('✅ Loaded Permissions:', permissionsWithIds);
  }, [permissions]);

  const handleToggle = (menuId, permKey) => {
    setPermissions((prev) =>
      prev.map((p) => (p.menu_name === menuId ? { ...p, [permKey]: !p[permKey] } : p))
    );
  };

  return (
    <Stack spacing={6} direction={{ md: 'row', xs: 'column' }}>
      <Box sx={{ minHeight: 200, minWidth: 350 }}>
        <RichTreeView
          items={permissionsWithIds}
          defaultExpandedItems={permissionsWithIds.map((p) => p.id)}
          slots={{
            item: (props) => (
              <PermissionTreeItem
                {...props}
                item={props}
                togglePermission={handleToggle}
              />
            )
          }}
          isItemDisabled={(item) => Boolean(item?.disabled)}
          isItemEditable={(item) => Boolean(item?.editable)}
        />
      </Box>

      <StatusLegend />
    </Stack>
  );
}
