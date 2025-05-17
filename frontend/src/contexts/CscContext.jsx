import { createContext, useContext, useState } from 'react';

const CscContext = createContext(null);

export const CscProvider = ({ children }) => {
  const [csc, setCsc] = useState('');

  const value = { csc, setCsc };

  return <CscContext.Provider value={value}>{children}</CscContext.Provider>;
};

export const useCsc = () => {
  const context = useContext(CscContext);
  if (context === null) {
    throw new Error('useCsc must be used within a CscProvider');
  }
  return context;
};
