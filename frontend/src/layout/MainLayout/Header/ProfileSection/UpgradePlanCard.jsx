import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

export default function UpgradePlanCard() {
  const cardSX = (theme) => ({
    content: '""',
    position: 'absolute',
    width: 200,
    height: 200,
    borderColor: theme.palette.warning.main
  });

  return (
    <Card
      sx={(theme) => ({
        bgcolor: theme.palette.warning.light,
        my: 2,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          border: `19px solid ${theme.palette.warning.main}`,
          borderRadius: '50%',
          top: '65px',
          right: '-150px',
          ...cardSX(theme)
        },
        '&:before': {
          border: `3px solid ${theme.palette.warning.main}`,
          borderRadius: '50%',
          top: '145px',
          right: '-70px',
          ...cardSX(theme)
        }
      })}
    >
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid>
            <Typography variant="h4">Upgrade your plan</Typography>
          </Grid>
          <Grid>
            <Typography
              variant="subtitle2"
              sx={(theme) => ({
                color: theme.palette.grey[900],
                opacity: 0.6
              })}
            >
              70% discount for 1 years <br />
              subscriptions.
            </Typography>
          </Grid>
          <Grid>
            <Stack direction="row">
              <Link sx={{ textDecoration: 'none' }} href="https://links.codedthemes.com/hsqll" target="_blank" rel="noopener">
                <AnimateButton>
                  <Button variant="contained" color="warning" sx={{ boxShadow: 'none' }}>
                    Go Premium
                  </Button>
                </AnimateButton>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
