import { useContext } from 'react';
import { NetworkStatusContext } from './NetworkStatusContext';

const useNetworkStatus = () => {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus debe usarse dentro de NetworkStatusProvider');
  }
  return context;
};

export default useNetworkStatus;
