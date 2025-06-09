import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

export default function Greeting() {
  const { locale } = useI18n();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting(locale.UI.GREETINGS.MORNING);
    } else if (currentHour < 18) {
      setGreeting(locale.UI.GREETINGS.AFTERNOON);
    } else {
      setGreeting(locale.UI.GREETINGS.EVENING);
    }
  }, [locale]); 

  return <Typography variant="h4">{greeting}</Typography>;
}
