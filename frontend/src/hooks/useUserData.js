import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';
import useLocalStorage from './useLocalStorage';

export default function useUserData(userId) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userDataToken] = useLocalStorage('wayne-user-data', {});
  const token = userDataToken.authToken || null;

  useEffect(() => {
    if (!userId) return;

    if (!token) {
      setError(new Error('No access token found'));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_ROUTES.USERS}${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { userData, loading, error };
}
