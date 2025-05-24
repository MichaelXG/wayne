import { createContext, useContext, useState } from 'react';

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const [permissions, setPermissions] = useState([]);

  return <PermissionsContext.Provider value={{ permissions, setPermissions }}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
