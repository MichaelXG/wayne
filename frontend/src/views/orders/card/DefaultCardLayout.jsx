import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { Box, IconButton, Tooltip } from '@mui/material';

import React from 'react';
import AnimateButton from '../../../ui-component/extended/AnimateButton';

export default function DefaultCardLayout({ subCardTitle, actionbutton, children }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Grid item xs={12} sx={{ width: '100%', margin: 0 }}>
      <SubCard
        title={
          <Box sx={{ width: '100%' }}>
            {/* Linha com Título e Botão */}
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant={downMD ? 'h5' : 'h4'}
                  sx={(theme) => ({
                    color: theme.palette.grey[600],
                    fontWeight: 600
                  })}
                >
                  {' '}
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
                      disabled={actionbutton.disabled ?? false}
                      color={actionbutton.color || theme.palette.grey[600]}
                      size="medium"
                      href={actionbutton.href}
                      onClick={actionbutton.onClick}
                      type={actionbutton.type || 'button'}
                      sx={(theme) => ({
                        backgroundColor: theme.palette.grey[300],
                        '&:hover': {
                          backgroundColor: theme.palette.grey[600],
                          color: theme.palette.common.white
                        }
                      })}
                    >
                      {actionbutton.icon}
                    </IconButton>
                  </Tooltip>
                </AnimateButton>
              )}
            </Box>
          </Box>
        }
      >
        <Grid item xs={12} sx={{ width: '100%', margin: 0 }} container spacing={gridSpacing}>
          {children}
        </Grid>
      </SubCard>
    </Grid>
  );
}

DefaultCardLayout.propTypes = {
  subCardTitle: PropTypes.string.isRequired,
  actionbutton: PropTypes.shape({
    label: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.node,
    color: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string
  }),
  children: PropTypes.node
};
