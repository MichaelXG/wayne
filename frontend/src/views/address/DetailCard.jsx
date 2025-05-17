import { Box, Card, CardContent, Chip, Stack, Typography, Divider, TextField, Grid, CardHeader } from '@mui/material';
import PropTypes from 'prop-types';
import { formatCep } from '../../utils/validator';

export default function DetailCard({
  id,
  street,
  number,
  neighborhood,
  city,
  state,
  postal_code,
  country,
  complement,
  reference,
  is_active = false,
  is_default = false
}) {
  if (!id || !street || !number || !city) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error">❌ Address data is incomplete.</Typography>
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
          <Stack direction="row" gap={2}>
            <Chip label={is_default ? 'Default' : 'Not Default'} color={is_default ? 'primary' : 'default'} size="small" />
            <Chip
              label={is_active ? 'Active' : 'Inactive'}
              color={is_active ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        </Box>

        <Card
          elevation={0}
          sx={{ mt: 3, borderRadius: 2, boxShadow: 'rgba(145, 158, 171, 0.2)', bgcolor: '#FFFFFF', border: '1px solid #DFE3E8', p: 3 }}
        >
          {' '}
          <CardHeader title="Details" subheader="Basic address information" titleTypographyProps={{ variant: 'h6' }} sx={{ px: 0 }} />
          <Divider />
          <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Stack spacing={2}>
                <Grid container spacing={2}>
                  {/* Postal Code */}
                  <Grid item xs={12} sm={4}>
                    <TextField label="Postal Code" value={formatCep(postal_code) || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>

                  {/* Street + Number */}
                  <Grid item xs={12} sm={10}>
                    <TextField label="Street" value={street || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField label="Number" value={number || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>

                  {/* Complement + Neighborhood */}
                  <Grid item xs={6}>
                    <TextField label="Complement" value={complement || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="Neighborhood" value={neighborhood || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>

                  {/* City + State + Country */}
                  <Grid item xs={12} sm={8}>
                    <TextField label="City" value={city || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField label="State" value={state || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField label="Country" value={country || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>

                  {/* Reference */}
                  <Grid item xs={12}>
                    <TextField label="Reference" value={reference || '-'} fullWidth InputProps={{ readOnly: true }} />
                  </Grid>
                </Grid>

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
  street: PropTypes.string,
  number: PropTypes.string,
  neighborhood: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postal_code: PropTypes.string,
  country: PropTypes.string,
  complement: PropTypes.string,
  reference: PropTypes.string,
  is_active: PropTypes.bool,
  is_default: PropTypes.bool
};
