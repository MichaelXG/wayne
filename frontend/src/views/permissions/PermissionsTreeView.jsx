import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { TreeItemContent, TreeItemRoot, TreeItemGroupTransition, TreeItemIconContainer, TreeItemLabel } from '@mui/x-tree-view/TreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';

import { useEffect, useState } from 'react';
import { API_ROUTES } from '../../routes/ApiRoutes';
import axiosInstance from '../../services/axios';

function PermissionLegend() {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2">Legend:</Typography>
      <Typography variant="body2">- Check to enable permission</Typography>
      <Typography variant="body2">- Uncheck to disable permission</Typography>
    </Paper>
  );
}

const PermissionTreeItem = React.forwardRef(function PermissionTreeItem(
  { id, itemId, label, children, can_read, can_create, can_update, can_delete, onToggle },
  ref
) {
  const { getContextProviderProps, getRootProps, getContentProps, getGroupTransitionProps } = useTreeItem({
    id,
    itemId,
    label,
    rootRef: ref
  });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemLabel>{label}</TreeItemLabel>
          <Stack direction="row" spacing={1}>
            {['read', 'create', 'update', 'delete'].map((perm) => (
              <Checkbox key={perm} checked={!!eval(`can_${perm}`)} size="small" onChange={() => onToggle(perm)} />
            ))}
          </Stack>
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function PermissionsTreeView() {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axiosInstance.get(API_ROUTES.MY_PERMISSIONS);
        const structured = response.data.permissions.map((perm) => ({
          id: perm.menu_name,
          label: perm.menu_name,
          can_read: perm.can_read,
          can_create: perm.can_create,
          can_update: perm.can_update,
          can_delete: perm.can_delete
        }));
        setPermissions(structured);
      } catch (error) {
        console.error('Failed to fetch permissions', error);
      }
    };
    fetchPermissions();
  }, []);

  const handleToggle = (menuId, action) => {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.id === menuId) {
          return { ...perm, [`can_${action}`]: !perm[`can_${action}`] };
        }
        return perm;
      })
    );
    // Aqui você pode adicionar lógica de persistência no backend com `axios.post`
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 300, minWidth: 400 }}>
        <RichTreeView
          items={permissions}
          defaultExpandedItems={permissions.map((p) => p.id)}
          slots={{ item: ({ item }) => <PermissionTreeItem {...item} onToggle={(action) => handleToggle(item.id, action)} /> }}
        />
      </Box>
      <PermissionLegend />
    </Stack>
  );
}
