import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import WantedCard from './card/WantedCard';

const criminals = [
  {
    name: 'Oswald Cobblepot',
    alias: 'The Penguin',
    avatar: '/images/penguin.png',
    reward: '250000',
    threat: 5,
    description: 'Crime lord with a love for birds and umbrellas. Operates the Iceberg Lounge.'
  },
  {
    name: 'Edward Nygma',
    alias: 'The Riddler',
    avatar: '/images/riddler.png',
    reward: '275000',
    threat: 4,
    description: 'Obsessed with riddles and puzzles. Leaves clues at crime scenes.'
  },
  {
    name: 'Harleen Quinzel',
    alias: 'Harley Quinn',
    avatar: '/images/harley.png',
    reward: '320000',
    threat: 5,
    description: 'Unpredictable and violent. Former psychiatrist turned criminal.'
  },
  {
    name: 'Jonathan Crane',
    alias: 'Scarecrow',
    avatar: '/images/scarecrow.png',
    reward: '220000',
    threat: 5,
    description: 'Master of fear toxins. Uses psychological warfare against victims.'
  },
  {
    name: 'Jarvis Tetch',
    alias: 'Mad Hatter',
    avatar: '/images/hatter.png',
    reward: '120000',
    threat: 3,
    description: 'Mind control specialist obsessed with Alice in Wonderland themes.'
  },
  {
    name: 'Selina Kyle',
    alias: 'Catwoman',
    avatar: '/images/catwoman.png',
    reward: '90000',
    threat: 3,
    description: 'Expert thief. Sometimes ally, sometimes enemy of Batman.'
  },
  {
    name: 'Basil Karlo',
    alias: 'Clayface',
    avatar: '/images/clayface.png',
    reward: '150000',
    threat: 4,
    description: 'Shapeshifting monster. Capable of disguising as anyone.'
  },
  {
    name: 'Pamela Isley',
    alias: 'Poison Ivy',
    avatar: '/images/ivy.png',
    reward: '200000',
    threat: 4,
    description: 'Eco-terrorist with control over plant life and poisonous touch.'
  },
  {
    name: 'Waylon Jones',
    alias: 'Killer Croc',
    avatar: '/images/killercroc.png',
    reward: '180000',
    threat: 5,
    description: 'Genetic mutation gave him reptilian appearance and strength.'
  },
  {
    name: 'Victor Fries',
    alias: 'Mr. Freeze',
    avatar: '/images/freeze.png',
    reward: '240000',
    threat: 4,
    description: 'Cryogenic expert with freezing tech. Driven by love and loss.'
  },
  {
    name: 'Roman Sionis',
    alias: 'Black Mask',
    avatar: '/images/blackmask.png',
    reward: '300000',
    threat: 5,
    description: 'Crime boss known for brutal tactics and skull-like mask.'
  }
];

const WantedList = () => (
  <Box sx={{
    minHeight: '100vh',
    background: '#d4c4a8',
    backgroundImage: 'url("/textures/wood-texture.png")',
    backgroundBlendMode: 'multiply',
    py: 6
  }}>
    <Container maxWidth="xl">
      <Typography 
        variant="h2" 
        sx={{ 
          textAlign: 'center',
          color: '#462f2f',
          fontFamily: "'Western', serif",
          mb: 4,
          textTransform: 'uppercase',
          fontWeight: 900,
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        Gotham's Most Wanted
      </Typography>
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
            sx={{
              display: 'flex',
              justifyContent: 'center',
              transform: `rotate(${Math.random() * 4 - 2}deg)`,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(0deg) scale(1.02)',
                zIndex: 1
              }
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
