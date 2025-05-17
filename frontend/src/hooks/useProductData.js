import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../routes/ApiRoutes';

export default function useProductData(productId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    axios
      .get(`${API_ROUTES.PRODUCTS}${productId}/`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [productId]);

  return { data, loading, error };
}
