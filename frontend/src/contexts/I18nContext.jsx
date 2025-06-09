import { createContext, useContext, useState, useEffect } from 'react';
import globalI18n from '../utils/GlobalI18n';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(globalI18n.language);
  const [locale, setLocale] = useState(globalI18n.getLocale());

  const changeLanguage = (lang) => {
    globalI18n.setLanguage(lang);
    setLanguage(lang);
    setLocale(globalI18n.getLocale());
  };

  // ✅ mantém sincronizado caso GlobalI18n mude por outros lugares
  useEffect(() => {
    setLocale(globalI18n.getLocale());
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, locale, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
