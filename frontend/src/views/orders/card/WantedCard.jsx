import React from 'react';
import { Card, CardContent, Avatar, Typography, Box, Stack, Divider, Chip } from '@mui/material';
import { Warning, MonetizationOn, Gavel } from '@mui/icons-material';

const WantedCard = ({ name, alias, avatar, cover, reward, threat, status }) => {
  return (
    <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6, maxWidth: 300, bgcolor: '#1c1c1c', color: 'white' }}>
      {/* Capa */}
      <Box sx={{ height: 120, backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

      {/* Avatar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: -6 }}>
        <Avatar src={avatar} sx={{ width: 80, height: 80, border: '4px solid white' }} />
      </Box>

      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>{alias}</Typography>

        {/* Status */}
        <Chip
          label={status === 'captured' ? 'Capturado' : 'Foragido'}
          color={status === 'captured' ? 'success' : 'error'}
          size="small"
          sx={{ mt: 1 }}
        />

        {/* Infos */}
        <Stack direction="row" justifyContent="space-around" sx={{ mt: 2 }}>
          <Box>
            <MonetizationOn fontSize="small" />
            <Typography variant="subtitle2">${reward}</Typography>
            <Typography variant="caption">Recompensa</Typography>
          </Box>
          <Box>
            <Warning fontSize="small" />
            <Typography variant="subtitle2">{threat}/5</Typography>
            <Typography variant="caption">Ameaça</Typography>
          </Box>
          <Box>
            <Gavel fontSize="small" />
            <Typography variant="subtitle2">{status === 'captured' ? '✓' : '✗'}</Typography>
            <Typography variant="caption">Status</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WantedCard;
