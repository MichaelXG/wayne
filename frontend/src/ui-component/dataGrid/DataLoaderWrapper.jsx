import React from 'react';
import PropTypes from 'prop-types';
import IllustrationMessage from '../message/IllustrationMessage';
import useFetchData from '../../hooks/useFetchData';
import { Box, CircularProgress } from '@mui/material';
import useLocalStorage from '../../hooks/useLocalStorage';

const isDebug = true;

const DataLoaderWrapper = ({ endpoint, options = {}, children, emptyMessage }) => {
  const [userData] = useLocalStorage('fake-store-user-data', {});
  const token = userData?.authToken;

  // Inclui o token no header da requisição se existir
  const mergedOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  const { data, loading, error } = useFetchData(endpoint, mergedOptions);

  if (isDebug) {
    console.log('📦 [DataLoaderWrapper] Endpoint:', endpoint);
    console.log('🔄 [DataLoaderWrapper] Loading:', loading);
    console.log('❌ [DataLoaderWrapper] Error:', error);
    console.log('📊 [DataLoaderWrapper] Data:', data);
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={2} width="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <IllustrationMessage
        type="error"
        customTitle="Something went wrong"
        customDescription={typeof error === 'string' ? error : 'An unexpected error occurred. Please try again.'}
      />
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <IllustrationMessage
        type={emptyMessage?.type || 'empty'}
        customTitle={emptyMessage?.title}
        customDescription={emptyMessage?.description}
      />
    );
  }

  return children(data);
};

DataLoaderWrapper.propTypes = {
  endpoint: PropTypes.string.isRequired,
  options: PropTypes.object,
  children: PropTypes.func.isRequired,
  emptyMessage: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  })
};

export default DataLoaderWrapper;
