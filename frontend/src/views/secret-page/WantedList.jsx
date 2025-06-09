import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import WantedCard from './card/WantedCard';

const BASE_WANTED_URL = 'https://raw.githubusercontent.com/MichaelXG/assets/main/wanter';

const criminals = [
  {
    name: 'Jerad Leto',
    alias: 'The Joker',
    avatar: `${BASE_WANTED_URL}/joker.png`,
    reward: '50000000',
    threat: 5,
    captured: false,
    description: 'Extremely dangerous psychopath. Known for causing chaos and mass destruction. Approach with extreme caution.'
  },
  {
    name: 'Oswald Cobblepot',
    alias: 'The Penguin',
    avatar: `${BASE_WANTED_URL}/penguin.png`,
    reward: '15000000',
    threat: 4,
    captured: true,
    description: 'Crime lord with a love for birds and umbrellas. Operates the Iceberg Lounge.'
  },
  {
    name: 'Edward Nygma',
    alias: 'The Riddler',
    avatar: `${BASE_WANTED_URL}/riddler.png`,
    reward: '10000000',
    threat: 4,
    captured: false,
    description: 'Obsessed with riddles and puzzles. Leaves clues at crime scenes.'
  },
  {
    name: 'Harleen Quinzel',
    alias: 'Harley Quinn',
    avatar: `${BASE_WANTED_URL}/harley.png`,
    reward: '8000000',
    threat: 3,
    captured: false,
    description: 'Unpredictable and violent. Former psychiatrist turned criminal.'
  },
  {
    name: 'Jonathan Crane',
    alias: 'Scarecrow',
    avatar: `${BASE_WANTED_URL}/scarecrow.png`,
    reward: '12000000',
    threat: 4,
    captured: true,
    description: 'Master of fear toxins. Uses psychological warfare against victims.'
  },
  {
    name: 'Jarvis Tetch',
    alias: 'Mad Hatter',
    avatar: `${BASE_WANTED_URL}/hatter.png`,
    reward: '5000000',
    threat: 2,
    captured: false,
    description: 'Mind control specialist obsessed with Alice in Wonderland themes.'
  },
  {
    name: 'Selina Kyle',
    alias: 'Catwoman',
    avatar: `${BASE_WANTED_URL}/catwoman.png`,
    reward: '3000000',
    threat: 2,
    captured: false,
    description: 'Expert thief. Sometimes ally, sometimes enemy of Batman.'
  },
  {
    name: 'Basil Karlo',
    alias: 'Clayface',
    avatar: `${BASE_WANTED_URL}/clayface.png`,
    reward: '7000000',
    threat: 3,
    captured: true,
    description: 'Shapeshifting monster. Capable of disguising as anyone.'
  },
  {
    name: 'Pamela Isley',
    alias: 'Poison Ivy',
    avatar: `${BASE_WANTED_URL}/ivy.png`,
    reward: '9000000',
    threat: 3,
    captured: false,
    description: 'Eco-terrorist with control over plant life and poisonous touch.'
  },
  {
    name: 'Waylon Jones',
    alias: 'Killer Croc',
    avatar: `${BASE_WANTED_URL}/killercroc.png`,
    reward: '6000000',
    threat: 3,
    captured: true,
    description: 'Genetic mutation gave him reptilian appearance and strength.'
  },
  {
    name: 'Victor Fries',
    alias: 'Mr. Freeze',
    avatar: `${BASE_WANTED_URL}/freeze.png`,
    reward: '8000000',
    threat: 3,
    captured: false,
    description: 'Cryogenic expert with freezing tech. Driven by love and loss.'
  },
  {
    name: 'Roman Sionis',
    alias: 'Black Mask',
    avatar: `${BASE_WANTED_URL}/blackmask.png`,
    reward: '20000000',
    threat: 4,
    captured: false,
    description: 'Crime boss known for brutal tactics and skull-like mask.'
  }
];

const WantedList = () => (
  <Box sx={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    py: 8
  }}>
    <Container maxWidth="xl">
      <Box sx={{ 
        mb: 6, 
        textAlign: 'center',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '3px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '2px'
        }
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#fff',
            fontWeight: 800,
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0.95
          }}
        >
          Gotham's Most Wanted
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          These dangerous criminals are currently at large in Gotham City. 
          Exercise extreme caution and report any sightings to GCPD immediately.
        </Typography>
      </Box>

      <Grid 
        container 
        spacing={4} 
        sx={{ 
          px: { xs: 2, sm: 4 },
        }}
      >
        {criminals.map((criminal, idx) => (
          <Grid 
            item 
            key={idx} 
            xs={12} 
            sm={6} 
            md={4}
            lg={3}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <WantedCard {...criminal} />
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default WantedList;
