import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// MUI - Hooks
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// MUI - Componentes
import { Box, Breadcrumbs, Grid, IconButton, Tooltip, Typography } from '@mui/material';

// MUI - Constantes
import { gridSpacing } from 'store/constant';

// MUI - Cartões personalizados
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

// Ícones
import { IconShieldCheck, IconShieldX, IconTrash } from '@tabler/icons-react';

// Componentes internos
import AnimateButton from '../ui-component/extended/AnimateButton';

// Contexto
import { useOrder } from '../contexts/StoredOrderIDContext';

// Utils
import { statusColors, statusIcons } from '../utils/statusUtils';

export default function DefaultMinimalLayout({
  mainCardTitle,
  subCardTitle,
  children,
  breadcrumbs = [],
  actionbutton,
  actionClose,
  checkingAuth
}) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { clearOrder } = useOrder();

  const authIcon = checkingAuth ? (
    <Tooltip
      title="User authenticated"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.success.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          })
        }
      }}
    >
      <IconShieldCheck color={theme.palette.success.main} size={20} />{' '}
    </Tooltip>
  ) : (
    <Tooltip
      title="Authentication failed"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.error.main,
            color: theme.palette.common.white,
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: theme.shadows[2]
          })
        }
      }}
    >
      <IconShieldX color={theme.palette.error.main} size={20} />
    </Tooltip>
  );

  return (
    <MainCard
      title={mainCardTitle}
      secondary={
        <Box display="flex" alignItems="center" gap={1}>
          {authIcon}
        </Box>
      }
    >
      <Grid item xs={12} sx={{ width: '100%', margin: 0 }}>
        <SubCard
          title={
            <Box sx={{ width: '100%' }}>
              {/* Linha com Título e Botão */}
              <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Typography
                  variant={downMD ? 'h5' : 'h4'}
                  sx={(theme) => ({
                    color: theme.palette.grey[600],
                    fontWeight: 600
                  })}
                >
                  {subCardTitle}
                </Typography>

                <Box display="flex" alignItems="center" gap={1}>
                  {actionClose && (
                    <AnimateButton>
                      <Tooltip
                        title={actionClose.label || 'Edit'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: (theme) => ({
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: theme.shadows[2]
                            })
                          }
                        }}
                      >
                        <IconButton
                          color={actionClose.color || 'error'}
                          size="medium"
                          href={actionClose.href}
                          onClick={actionClose.onClick}
                          type={actionClose.type || 'button'}
                          sx={{
                            backgroundColor: (theme) => theme.palette.error.light,
                            color: (theme) => theme.palette.error.main,
                            '&:hover': {
                              backgroundColor: (theme) => theme.palette.error.main,
                              color: (theme) => theme.palette.common.white
                            }
                          }}
                        >
                          {actionClose.icon}
                        </IconButton>
                      </Tooltip>
                    </AnimateButton>
                  )}

                  {/* Direita: Botão de ação */}
                  {actionbutton && (
                    <AnimateButton>
                      <Tooltip
                        title={actionbutton.label || 'Edit'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: (theme) => ({
                              backgroundColor: theme.palette.grey[600],
                              color: theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: theme.shadows[2]
                            })
                          }
                        }}
                      >
                        <IconButton
                          disabled={actionbutton.disabled ?? false}
                          color={actionbutton.color || theme.palette.grey[600]}
                          size="medium"
                          href={actionbutton.href}
                          onClick={actionbutton.onClick}
                          type={actionbutton.type || 'button'}
                          sx={{
                            backgroundColor: theme.palette.grey[300],
                            '&:hover': {
                              backgroundColor: theme.palette.grey[600],
                              color: theme.palette.common.white
                            }
                          }}
                        >
                          {actionbutton.icon}
                        </IconButton>
                      </Tooltip>
                    </AnimateButton>
                  )}
                </Box>
              </Box>

              {/* Breadcrumbs abaixo do título */}
              {breadcrumbs?.length > 0 && (
                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Breadcrumbs>
                    {breadcrumbs.map((item, index) => {
                      const isLast = index === breadcrumbs.length - 1;

                      if (isLast && item.type === 'status') {
                        const statusKey = item.label?.toLowerCase();
                        const color = statusColors[statusKey] || 'default';
                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              px: 1.5,
                              py: 0.5,
                              backgroundColor: theme.palette[color]?.light,
                              color: theme.palette[color]?.dark,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              borderRadius: '6px',
                              textTransform: 'capitalize'
                            }}
                          >
                            {statusIcons[statusKey]}
                            <Box ml={0.5}>{item.label}</Box>
                          </Box>
                        );
                      }

                      return item.href ? (
                        <Typography
                          key={index}
                          component="a"
                          href={item.href}
                          variant="body2"
                          fontWeight={500}
                          sx={{
                            color: theme.palette.grey[600],
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {item.label}
                        </Typography>
                      ) : (
                        <Typography key={index} variant="body2" fontWeight={500} color="text.primary">
                          {item.label}
                        </Typography>
                      );
                    })}
                  </Breadcrumbs>

                  {/* Botão de limpar ordem */}
                  {clearOrder && (
                    <AnimateButton>
                      <Tooltip
                        title={'Clear Order'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: (theme) => ({
                              backgroundColor: theme.palette.error.main,
                              color: theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: theme.shadows[2]
                            })
                          }
                        }}
                      >
                        <IconButton
                          color={'error'}
                          size="medium"
                          onClick={clearOrder}
                          type={'button'}
                          sx={{
                            backgroundColor: (theme) => theme.palette.error.light,
                            color: (theme) => theme.palette.error.main,
                            '&:hover': {
                              backgroundColor: (theme) => theme.palette.error.main,
                              color: (theme) => theme.palette.common.white
                            }
                          }}
                        >
                          <IconTrash size={18} />
                        </IconButton>
                      </Tooltip>
                    </AnimateButton>
                  )}
                </Box>
              )}
            </Box>
          }
        >
          <Grid item xs={12} sx={{ width: '100%', margin: 0 }} container spacing={gridSpacing}>
            {children}
          </Grid>
        </SubCard>
      </Grid>
    </MainCard>
  );
}

DefaultMinimalLayout.propTypes = {
  mainCardTitle: PropTypes.string.isRequired,
  subCardTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      type: PropTypes.string
    })
  ),
  actionbutton: PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.node,
    href: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    color: PropTypes.string
  }),
  actionClose: PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.node,
    href: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
    color: PropTypes.string
  }),
  checkingAuth: PropTypes.bool
};
