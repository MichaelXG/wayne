import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useEffect } from 'react';

export default function PermissionsList() {
  const { permissions, loadPermissions } = usePermissions();

  useEffect(() => {
    console.log('✅ Loaded Permissions:', permissions);
  }, [permissions]);

  if (!permissions) {
    return (
      <Box mt={2}>
        <Typography variant="subtitle1" color="textSecondary">
          Loading permissions...
        </Typography>
      </Box>
    );
  }

  if (permissions.length === 0) {
    return (
      <Box mt={2}>
        <Typography variant="subtitle1" color="textSecondary">
          No permissions loaded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Typography variant="h6">User Permissions</Typography>
      <List>
        {permissions.map((perm, index) => (
          <Box key={index}>
            <ListItem>
              <ListItemText
                primary={perm.menu_name}
                secondary={`View: ${perm.can_view ? '✅' : '❌'}, Create: ${perm.can_create ? '✅' : '❌'}, Update: ${perm.can_update ? '✅' : '❌'}, Delete: ${perm.can_delete ? '✅' : '❌'}`}
              />
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
}
