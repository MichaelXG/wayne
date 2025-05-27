import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
import { TreeItemContent, TreeItemRoot, TreeItemGroupTransition, TreeItemLabel } from '@mui/x-tree-view/TreeItem';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { usePermissions } from '../../contexts/PermissionsContext';

function PermissionLegend() {
  return (
    <Card variant="outlined" sx={{ maxWidth: 400, mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Legend
        </Typography>
        <Typography variant="body2">🔒 Locked → Disabled permission</Typography>
        <Typography variant="body2">🔓 Unlocked → Enabled permission</Typography>
      </CardContent>
    </Card>
  );
}

function CustomPermissionContent({ children, item, togglePermission, ...props }) {
  return (
    <TreeItemContent {...props}>
      <TreeItemLabel>{item.label}</TreeItemLabel>
      <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
        {['can_read', 'can_create', 'can_update', 'can_delete', 'can_secret'].map((perm) => (
          <Tooltip key={perm} title={perm.replace('can_', '').toUpperCase()}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                togglePermission(item.id, perm);
              }}
              sx={{
                color: item[perm] ? 'success.main' : 'grey.500'
              }}
            >
              {item[perm] ? <LockOpenOutlinedIcon fontSize="small" /> : <LockOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </TreeItemContent>
  );
}

const PermissionTreeItem = React.forwardRef(function PermissionTreeItem({ item, togglePermission }, ref) {
  const { getContextProviderProps, getRootProps, getContentProps, getGroupTransitionProps } = useTreeItem({
    ...item,
    rootRef: ref
  });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <CustomPermissionContent {...getContentProps()} item={item} togglePermission={togglePermission} />
        {item.children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

export default function PermissionsTreeView() {
  const { permissions, setPermissions } = usePermissions();

  useEffect(() => {
    console.log('✅ Loaded Permissions:', permissions);
  }, [permissions]);

  const handleToggle = (menuId, action) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.menu_name === menuId ? { ...perm, [action]: !perm[action] } : perm
      )
    );
    // TODO: persist changes in backend with axios.post
  };

  // ✅ Criar estrutura compatível para RichTreeView
  const permissionsWithIds = permissions.map((perm) => ({
    ...perm,
    id: perm.menu_name,
    itemId: perm.menu_name,
    label: perm.menu_name
  }));

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Permissions Tree
      </Typography>
      <Card variant="outlined">
        <CardContent sx={{ maxHeight: 500, overflowY: 'auto' }}>
          <RichTreeView
            items={permissionsWithIds}
            defaultExpandedItems={permissionsWithIds.map((p) => p.id)}
            slots={{ item: PermissionTreeItem }}
            slotProps={{
              item: (item) => ({
                item,
                togglePermission: handleToggle
              })
            }}
          />
        </CardContent>
      </Card>
      <PermissionLegend />
    </Box>
  );
}
