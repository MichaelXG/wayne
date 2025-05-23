import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Tooltip from '@mui/material/Tooltip';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { IconShieldCheck, IconShieldX } from '@tabler/icons-react';

import AnimateButton from 'ui-component/extended/AnimateButton';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';

export default function DefaultLayout({ mainCardTitle, subCardTitle, children, backButton, breadcrumbs = [], actionbutton, checkingAuth }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

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
  
  const renderBackButton = () => {
    const iconButtonStyles = (theme) => ({
      mt: 1,
      mb: 2,
      width: 24,
      height: 24,
      padding: '3px',
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[600],
      borderRadius: '50%',
      '&:hover': {
        backgroundColor: theme.palette.grey[600],
        color: theme.palette.common.white
      }
    });

    const handleBackClick = () => {
      if (backButton?.type === 'link' && backButton.link) {
        navigate(backButton.link);
      } else {
        navigate('/dashboard/default');
      }
    };

    return (
      <Tooltip
        title="Go Back"
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
        <IconButton onClick={handleBackClick} sx={iconButtonStyles}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

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
                <Box display="flex" alignItems="center" gap={1}>
                  {renderBackButton()}
                  <Typography
                    variant={downMD ? 'h5' : 'h4'}
                    sx={(theme) => ({
                      color: theme.palette.grey[600],
                      fontWeight: 600
                    })}
                  >
                    {subCardTitle}
                  </Typography>
                </Box>

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
                        color={actionbutton.color || theme.palette.grey[600]}
                        size="medium"
                        href={actionbutton.href}
                        onClick={actionbutton.onClick}
                        type={actionbutton.type || 'button'}
                        sx={{
                          backgroundColor: theme.palette.grey[300],
                          '&:hover': {
                            backgroundColor: theme.palette.grey[600],
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

              {/* Breadcrumbs abaixo do título */}
              {breadcrumbs?.length > 0 && (
                <Box mt={1}>
                  <Breadcrumbs>
                    {breadcrumbs.map((item, index) =>
                      item.href ? (
                        <Typography
                          key={index}
                          component="a"
                          href={item.href}
                          variant="body2"
                          fontWeight={500}
                          sx={(theme) => ({
                            color: theme.palette.grey[600],
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          })}
                        >
                          {item.label}
                        </Typography>
                      ) : (
                        <Typography
                          key={index}
                          variant="body2"
                          fontWeight={500}
                          sx={(theme) => ({
                            color: theme.palette.text.primary
                          })}
                        >
                          {item.label}
                        </Typography>
                      )
                    )}
                  </Breadcrumbs>
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

DefaultLayout.propTypes = {
  mainCardTitle: PropTypes.string.isRequired,
  subCardTitle: PropTypes.string.isRequired,
  children: PropTypes.node,
  backButton: PropTypes.shape({
    type: PropTypes.oneOf(['link']),
    link: PropTypes.string
  })
};
