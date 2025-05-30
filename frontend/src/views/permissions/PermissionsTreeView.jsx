// 📁 components/PermissionsTreeView.jsx
import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Stack, Paper, Typography, Tooltip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import MainCard from '../../ui-component/cards/MainCard';
import PermissionTreeItem from './PermissionTreeItem';
import { gridSpacing } from '../../store/constant';
import { IconShieldCheck } from '@tabler/icons-react';
import AdjustIcon from '@mui/icons-material/Adjust';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { API_ROUTES } from '../../routes/ApiRoutes';
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
  error: <ErrorOutlineOutlinedIcon color="info" fontSize="small" />,
  modified: <ErrorOutlineOutlinedIcon color="warning" fontSize="small" />
};

function StatusLegend() {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      elevation={0}
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

// Função para converter array flat em árvore
function buildTree(flatList) {
  const lookup = {};
  const rootItems = [];

  flatList.forEach((item) => {
    lookup[item.id] = { ...item, children: [] };
  });

  flatList.forEach((item) => {
    if (item.parentId) {
      const parent = lookup[item.parentId];
      if (parent) parent.children.push(lookup[item.id]);
    } else {
      rootItems.push(lookup[item.id]);
    }
  });

  return rootItems;
}

export default function PermissionsTreeView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState([]);
  const [userData] = useLocalStorage('wayne-user-data', {});
  const token = userData?.authToken || null;

  const fetchPermissionsTree = async () => {
    try {
      const res = await axios.get(`${API_ROUTES.PREMISSIONS_TREE}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const treeData = buildTree(res.data);
      setItems(treeData);
    } catch (error) {
      console.error('Failed to fetch permissions tree:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPermissionsTree();
  }, [token]);

  const handleToggle = (groupId, menuName, permKey) => {
    const toggleRecursive = (nodes) =>
      nodes.map((node) => {
        if (node.groupId === groupId && node.menu_name === menuName && node.permissionKey === permKey) {
          return {
            ...node,
            checked: !node.checked,
            status: { ...node.status, modified: true, icon: STATUS_ICONS.modified }
          };
        }
        if (node.children) {
          return { ...node, children: toggleRecursive(node.children) };
        }
        return node;
      });

    setItems((prev) => toggleRecursive(prev));
  };

  const authIcon = (
    <Tooltip title="User authenticated">
      <IconShieldCheck color={theme.palette.success.main} size={20} />
    </Tooltip>
  );

  return (
    <MainCard
      title="Permissions Groups"
      secondary={authIcon}
      contentSX={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Stack spacing={6} direction={{ md: 'row', xs: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 200, minWidth: 300 }}>
              {loading ? (
                <Stack alignItems="center" justifyContent="center" height="100%">
                  <CircularProgress />
                </Stack>
              ) : (
                <RichTreeView
                  items={items}
                  getItemId={(item) => item.id}
                  getItemLabel={(item) => item.label}
                  getItemChildren={(item) => item.children || []}
                  // defaultExpandedItems={[]} // collapsed by default
                  // expandedItems={expandedItems}
                  // onExpandedItemsChange={setExpandedItems}
                  slots={{
                    item: (props) => <PermissionTreeItem {...props} togglePermission={handleToggle} />
                  }}
                  // isItemDisabled={(item) => Boolean(item?.disabled)}
                  // isItemEditable={(item) => Boolean(item?.editable)}
                />
              )}
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
