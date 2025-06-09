import { Box, Card, CardContent, Chip, Stack, Typography, Divider, TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function DetailCard({ id, name, prefix, slug, is_default = false, is_active = false }) {
  if (!id || !name || !prefix || !slug) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error">❌ Carrier data is incomplete.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 6 },
        backgroundColor: 'background.default'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* ID à esquerda */}
          <Chip
            label={`ID: ${id}`}
            size="small"
            sx={(theme) => ({
              fontWeight: 600,
              fontSize: '0.75rem',
              color: theme.palette.common.white,
              backgroundColor: theme.palette.grey[600],
              width: 'fit-content'
            })}
          />

          {/* Chips à direita */}
          <Stack direction="row" spacing={1}>
            {is_default && (
              <Chip
                label="Default"
                size="small"
                sx={(theme) => ({
                  fontWeight: theme.typography.fontWeightBold,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.common.white
                })}
              />
            )}
          </Stack>
        </Box>

        <Card
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            borderRadius: 3,
            boxShadow: 4,
            maxWidth: 1000,
            width: '100%',
            p: 3
          }}
        >
          <CardContent
            sx={{
              p: 0,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="flex-end" width="100%">
                  <Chip
                    label={is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={(theme) => ({
                      fontWeight: theme.typography.fontWeightBold,
                      bgcolor: theme.palette[is_active ? 'success' : 'error'].dark,
                      color: theme.palette.common.white
                    })}
                  />
                </Box>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Carrier Name"
                    value={name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={(theme) => ({
                      '& label.Mui-focused': {
                        color: theme.palette.grey[600]
                      },
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.grey[600]
                        }
                      }
                    })}
                  />

                  <TextField
                    label="Slug"
                    value={(slug || '').toLowerCase()}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    sx={(theme) => ({
                      width: 140,
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: theme.palette.text.primary
                      },
                      '& label.Mui-focused': {
                        color: theme.palette.grey[600]
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          transition: 'border-color 0.3s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.grey[300]
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.grey[600]
                        }
                      }
                    })}
                  />

                  <TextField
                    label="Prefix"
                    value={(prefix || '').toUpperCase()}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    sx={(theme) => ({
                      width: 140,
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: theme.palette.text.primary
                      },
                      '& label.Mui-focused': {
                        color: theme.palette.grey[600]
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          transition: 'border-color 0.3s ease'
                        },
                        '&:hover fieldset': {
                          borderColor: theme.palette.grey[300]
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.grey[600]
                        }
                      }
                    })}
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

DetailCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  prefix: PropTypes.string,
  is_default: PropTypes.bool,
  is_active: PropTypes.bool
};
