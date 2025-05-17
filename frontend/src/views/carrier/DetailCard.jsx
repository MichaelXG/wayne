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
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* ID à esquerda */}
          <Chip
            label={`ID: ${id}`}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              color: '#FFFFFF',
              backgroundColor: '#8E33FF',
              width: 'fit-content'
            }}
          />
          {/* Chips à direita */}
          <Stack direction="row" spacing={1}>
            {is_default && <Chip label="Default" size="small" color="primary" sx={{ fontWeight: 600, fontSize: '0.75rem' }} />}
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
                    color={is_active ? 'success' : 'error'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Carrier Name"
                    value={name}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{
                      '& label.Mui-focused': { color: 'secondary.main' },
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                      }
                    }}
                  />
                  
                  <TextField
                    label="Slug"
                    value={(slug || '').toLowerCase()}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    sx={{
                      width: 140,
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000'
                      },
                      '& label.Mui-focused': { color: 'secondary.main' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { transition: 'border-color 0.3s ease' },
                        '&:hover fieldset': { borderColor: 'secondary.light' },
                        '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                      }
                    }}
                  />

                  <TextField
                    label="Prefix"
                    value={(prefix || '').toUpperCase()}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    sx={{
                      width: 140,
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#000'
                      },
                      '& label.Mui-focused': { color: 'secondary.main' },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { transition: 'border-color 0.3s ease' },
                        '&:hover fieldset': { borderColor: 'secondary.light' },
                        '&.Mui-focused fieldset': { borderColor: 'secondary.main' }
                      }
                    }}
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
