import { createContext, useContext, useState } from 'react';

const UserIDContext = createContext();

export function UserIDProvider({ children }) {
  const [userId, setUserId] = useState(null);

  return <UserIDContext.Provider value={{ userId, setUserId }}>{children}</UserIDContext.Provider>;
}

export function useUserIDContext() {
  return useContext(UserIDContext);
}

export default {
  UserIDProvider,
  useUserIDContext
};
