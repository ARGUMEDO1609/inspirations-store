import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const NetworkStatusContext = createContext(null);

export const NetworkStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.navigator.onLine;
  });
  const [globalError, setGlobalError] = useState(null);

  const notifyError = useCallback((message) => {
    if (!message) return;
    setGlobalError(message);
  }, []);

  const clearError = useCallback(() => {
    setGlobalError(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleOnline = () => {
      setIsOnline(true);
      clearError();
    };
    const handleOffline = () => {
      setIsOnline(false);
      notifyError('Sin conexión. Verifica tu red para continuar.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [clearError, notifyError]);

  const value = useMemo(
    () => ({ isOnline, globalError, notifyError, clearError }),
    [isOnline, globalError, notifyError, clearError]
  );

  return <NetworkStatusContext.Provider value={value}>{children}</NetworkStatusContext.Provider>;
};