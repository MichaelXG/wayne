import React from 'react';
import { useI18n } from '../../../../contexts/I18nContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const LanguageSelector = () => {
  const { language, changeLanguage } = useI18n();

  const languages = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'pt', label: '🇧🇷 Português' }
  ];

  const handleChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="language-selector-label">Language</InputLabel>
      <Select labelId="language-selector-label" id="language-selector" value={language} onChange={handleChange} label="Language">
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
