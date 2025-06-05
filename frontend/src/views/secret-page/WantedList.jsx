import React from 'react';
import { Grid } from '@mui/material';
import WantedCard from '../orders/card/WantedCard';


const criminals = [
  {
    name: 'Oswald Cobblepot',
    alias: 'O Pinguim',
    avatar: '/images/pinguim.png',
    cover: '/images/gotham-bg.jpg',
    reward: '100.000',
    threat: 4,
    status: 'wanted'
  },
  {
    name: 'Harleen Quinzel',
    alias: 'Arlequina',
    avatar: '/images/harley.png',
    cover: '/images/chaos-bg.jpg',
    reward: '250.000',
    threat: 5,
    status: 'wanted'
  },
  {
    name: 'Edward Nygma',
    alias: 'Charada',
    avatar: '/images/riddler.png',
    cover: '/images/riddle-bg.jpg',
    reward: '175.000',
    threat: 3,
    status: 'captured'
  }
];

const WantedList = () => (
  <Grid container spacing={4} justifyContent="center" sx={{ p: 4 }}>
    {criminals.map((c, idx) => (
      <Grid item key={idx}>
        <WantedCard {...c} />
      </Grid>
    ))}
  </Grid>
);

export default WantedList;
