import React from 'react';
import { Box, Stack, Typography, Switch } from '@mui/material';
// Importa componentes de estrutura da árvore do MUI X Tree View
import { TreeItemContent, TreeItemRoot, TreeItemGroupTransition, TreeItemIconContainer } from '@mui/x-tree-view/TreeItem';
// Hook que fornece as props e status necessários para o item da árvore
import { useTreeItem } from '@mui/x-tree-view/useTreeItem';
// Provedor de contexto para o item da árvore
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';

export default function PermissionTreeItem(props) {
  // Desestrutura funções e status que o MUI Tree View fornece
  const { getRootProps, getContentProps, getIconContainerProps, getLabelProps, getGroupTransitionProps, getContextProviderProps, status } =
    useTreeItem(props);

  const { togglePermission, ...item } = props;
  if (!item) return null; // Garante que o item existe antes de renderizar

  // Define o espaçamento à esquerda com base no tipo do item (nível na hierarquia)
  const getPaddingLeft = () => {
    switch (item?.type) {
      case 'group':
        return 0;
      case 'menu':
        return 4;
      case 'permission':
        return 6;
      default:
        return 0;
    }
  };

  // Define o peso da fonte conforme o tipo do item
  const getFontWeight = () => {
    if (item?.type === 'group') return 'bold';
    if (item?.type === 'menu') return 500;
    return 'normal';
  };

  // Permissões ficam em itálico
  const getFontStyle = () => (item?.type === 'permission' ? 'italic' : 'normal');

  return (
    // Provedor de contexto do TreeItem
    <TreeItemProvider {...getContextProviderProps()}>
      {/* Wrapper da raiz do item */}
      <TreeItemRoot {...getRootProps()}>
        {/* Conteúdo principal do item */}
        <TreeItemContent {...getContentProps()}>
          {/* Ícone do colapso/expansão */}
          <TreeItemIconContainer {...getIconContainerProps()} />

          {/* Label do item com estilos condicionais */}
          <Box
            {...getLabelProps()}
            sx={{
              pl: getPaddingLeft(),
              fontWeight: getFontWeight(),
              fontStyle: getFontStyle(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* Texto do item */}
            <Typography variant="body2" component="span">
              {item.label}
            </Typography>

            {/* Se for do tipo permission, exibe um switch para ativar/desativar */}
            {item.type === 'permission' && (
              <Switch
                size="small"
                checked={!!item.checked}
                onChange={() => togglePermission?.(item.groupId, item.menu_name, item.permissionKey)}
                inputProps={{ 'aria-label': `Toggle ${item.label}` }}
              />
            )}
          </Box>
        </TreeItemContent>

        {/* Renderiza os filhos (menus e permissões aninhadas) com animação */}
        {item.children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
}
