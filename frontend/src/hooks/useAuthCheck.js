import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('wayne-user-data'));
    if (!user?.authToken) navigate('/login');
  }, []);
};
