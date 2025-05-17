
import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchData = (endpoint, options = {}) => {
  const [data, setData] = useState(null); // null quando não carregado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // objeto de erro

  useEffect(() => {
    if (!endpoint) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(endpoint, options);
        setData(response.data);
      } catch (err) {
        setError({
          type: 'error',
          title: 'Error loading data',
          description: 'Please try again later.'
        });
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return {
    data,
    setData,
    loading,
    error
  };
};

export default useFetchData;
