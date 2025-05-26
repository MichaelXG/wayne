import React from 'react';
import { useI18n } from '../../../../contexts/I18nContext';
import { FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import Flag from 'react-world-flags';

const LanguageSelector = () => {
  const { language, changeLanguage } = useI18n();

  const languages = [
    { code: 'us', country: 'US', label: 'English' },
    { code: 'pt', country: 'BR', label: 'Português' }
  ];

  const handleChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
      <InputLabel id="language-selector-label">🌐</InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={language}
        onChange={handleChange}
        label="🌐"
        renderValue={(selected) => {
          const selectedLang = languages.find((lang) => lang.code === selected);
          return selectedLang ? <Flag code={selectedLang.country} style={{ width: 24, height: 16, borderRadius: 2 }} /> : '🌐';
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Tooltip title={lang.label}>
              <span>
                <Flag code={lang.country} style={{ width: 24, height: 16, borderRadius: 2 }} />
              </span>
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
