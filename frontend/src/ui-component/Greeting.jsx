import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';

export default function Greeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning,');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon,');
    } else {
      setGreeting('Good Evening,');
    }
  }, []);

  return <Typography variant="h4">{greeting}</Typography>;
}
