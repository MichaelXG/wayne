// ✅ Importação de dependências e componentes
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

// ✅ Mapeamento de status para ícones
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

// ✅ Componente para exibir a legenda dos status
function StatusLegend() {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
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

// ✅ Componente para renderizar cada item da árvore: grupo ou menu
const PermissionTreeItem = React.forwardRef(function PermissionTreeItem({ item, togglePermission }, ref) {
  const { getContextProviderProps, getRootProps, getContentProps, getLabelProps, getGroupTransitionProps, getIconContainerProps, status } =
    useTreeItem({ ...item, rootRef: ref });

  const theme = useTheme();

  const isPermission = item.type === 'menu'; // ✅ agora mais direto
  const backgroundColor = item.type === 'group' ? theme.palette.grey[100] : theme.palette.grey[500];
  const textColor = theme.palette.common.white;

  // ✅ opcional: console para depurar item
  console.log('Rendering item:', item);

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent
          {...getContentProps()}
          sx={{
            backgroundColor,
            color: textColor,
            px: 1.5,
            py: 0.5,
            transition: 'background-color 0.3s',

            '&:hover': {
              backgroundColor: theme.palette.grey[600],
              cursor: 'pointer'
            },

            ...(status.selected && {
              backgroundColor: theme.palette.grey[600]
              // color: theme.palette.primary.contrastText
            }),

            ...(status.focused && {
              // outline: `2px solid ${theme.palette.grey[600]}`
              backgroundColor: theme.palette.grey[600]
              // color: theme.palette.primary.contrastText
            })
          }}
        >
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>

          <Box {...getLabelProps()}>
            <Typography
              variant="body2"
              sx={{
                color: textColor,
                px: 1.5,
                py: 0.5,
                textTransform: 'capitalize'
              }}
            >
              {item.label}
            </Typography>
          </Box>
        </TreeItemContent>

        {/* ✅ Renderiza permissões apenas se for item do tipo menu */}
        {/* {isPermission && ( */}
        {true && (
          <Stack spacing={1} sx={{ mt: 1, ml: 3 }}>
            {['can_read', 'can_create', 'can_update', 'can_delete'].map(
              (perm) =>
                item.hasOwnProperty(perm) && ( // ✅ Só renderiza se propriedade existir
                  <Stack key={perm} direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption">{perm.replace('can_', '').toUpperCase()}</Typography>
                    <Switch
                      size="small"
                      checked={item[perm] || false} // ✅ default false
                      onChange={() => togglePermission(item.groupId, item.menu_name, perm)}
                    />
                  </Stack>
                )
            )}
          </Stack>
        )}

        {item.children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

// ✅ Componente principal que monta e renderiza a árvore completa
export default function PermissionsTreeView() {
  const { groups, setGroups, loadGroups } = usePermissionsGroups();
  const [userData] = useLocalStorage('wayne-user-data', {});
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  const checkingAuth = useAuthGuard();

  // ✅ Ícone de status de autenticação
  const authIcon = !checkingAuth ? (
    <Tooltip
      title="User authenticated"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          }
        }
      }}
    >
      <IconShieldCheck color={theme.palette.success.main} size={20} />
    </Tooltip>
  ) : (
    <Tooltip
      title="Authentication failed"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          }
        }
      }}
    >
      <IconShieldX color={theme.palette.error.main} size={20} />
    </Tooltip>
  );

  // ✅ Carrega os grupos apenas uma vez após login
  useEffect(() => {
    if (!loaded && userData?.authToken) {
      loadGroups(userData.authToken);
      setLoaded(true);
    }
  }, [loaded, userData, loadGroups]);

  // ✅ Função para alterar permissões
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

  // ✅ Montagem da árvore: Grupos e Menus
  const treeItems = groups.map((group) => ({
    id: `group-${group.id}`,
    itemId: `group-${group.id}`,
    label: group.name,
    type: 'group', // ✅ Marcação de tipo
    children: group.permissions.map((perm) => ({
      ...perm,
      id: `perm-${group.id}-${perm.menu_name}`,
      itemId: `perm-${group.id}-${perm.menu_name}`,
      label: perm.menu_name,
      groupId: group.id,
      disabled: false,
      editable: false
      // type: 'menu' // ✅ Marcação de tipo
    }))
  }));

  return (
    <MainCard title="Permissions Groups" secondary={authIcon}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Stack spacing={6} direction={{ md: 'row', xs: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 200, minWidth: 350 }}>
              {/* ✅ RichTreeView renderiza os Grupos e Menus */}
              <RichTreeView
                items={treeItems}
                defaultExpandedItems={treeItems.map((g) => g.id)}
                // defaultExpandedItems={['pickers']}
                defaultSelectedItems={'pickers'}
                slots={{
                  item: (props) => <PermissionTreeItem {...props} item={props} togglePermission={handleToggle} />
                }}
                isItemDisabled={(item) => Boolean(item?.disabled)}
                isItemEditable={(item) => Boolean(item?.editable)}
              />
            </Box>

            {/* ✅ Legenda dos status */}
            <Box sx={{ flex: '0 0 auto', minWidth: 200 }}>
              <StatusLegend />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
