import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Box, IconButton, Breadcrumbs, Tooltip } from '@mui/material';
import {
  IconBan,
  IconCheck,
  IconClockHour4,
  IconPackage,
  IconShieldCheck,
  IconShieldX,
  IconTrash,
  IconTruckDelivery
} from '@tabler/icons-react';

import React from 'react';
import AnimateButton from '../ui-component/extended/AnimateButton';
import { useOrder } from '../contexts/StoredOrderIDContext';

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
  const navigate = useNavigate();
  const { clearOrder } = useOrder();

  const statusColors = {
    pending: 'warning',
    paid: 'success',
    processing: 'info',
    shipped: 'primary',
    canceled: 'error'
  };

  const statusIcons = {
    pending: <IconClockHour4 size={16} />,
    paid: <IconCheck size={16} />,
    processing: <IconPackage size={16} />,
    shipped: <IconTruckDelivery size={16} />,
    canceled: <IconBan size={16} />
  };

  const authIcon = checkingAuth ? (
    <Tooltip
      title="User authenticated"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'green',
            color: '#fff',
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: 2
          }
        }
      }}
    >
      <IconShieldCheck color="green" size={20} />
    </Tooltip>
  ) : (
    <Tooltip
      title="Authentication failed"
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: 'red',
            color: '#fff',
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            boxShadow: 2
          }
        }
      }}
    >
      <IconShieldX color="red" size={20} />
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
                {/* <Box display="flex" alignItems="center" gap={1}> */}
                <Typography variant={downMD ? 'h5' : 'h4'} sx={{ color: 'secondary.main', fontWeight: 600 }}>
                  {subCardTitle}
                </Typography>
                {/* </Box> */}
                <Box display="flex" alignItems="center" gap={1}>
                  {actionClose && (
                    <AnimateButton>
                      <Tooltip
                        title={actionClose.label || 'Edit'}
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: (theme) => theme.palette.error.main,
                              color: (theme) => theme.palette.common.white,
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: 2
                            }
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
                            sx: {
                              backgroundColor: '#8E33FF',
                              color: '#fff',
                              fontSize: 12,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              boxShadow: 2
                            }
                          }
                        }}
                      >
                        <IconButton
                          color={actionbutton.color || 'secondary'}
                          size="medium"
                          href={actionbutton.href}
                          onClick={actionbutton.onClick}
                          type={actionbutton.type || 'button'}
                          sx={{
                            backgroundColor: 'secondary.light',
                            '&:hover': {
                              backgroundColor: 'secondary.main',
                              color: 'white'
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
                        const icon = statusIcons[statusKey] || null;

                        return (
                          <Box
                            key={index}
                            sx={{
                              display: 'inline-flex',
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
                            {icon}
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
                            color: 'secondary.main',
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

                  <AnimateButton>
                    <Tooltip
                      title={'Clear Order'}
                      placement="top"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: (theme) => theme.palette.error.main,
                            color: (theme) => theme.palette.common.white,
                            fontSize: 12,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            boxShadow: 2
                          }
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
  children: PropTypes.node
};
