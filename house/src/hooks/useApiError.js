import { useCallback } from 'react';
import { useToast } from '../context/useToast';
import useNetworkStatus from '../context/useNetworkStatus';
import { getErrorMessage } from '../api/axios';

export const useApiError = () => {
  const { toast } = useToast();
  const { notifyError } = useNetworkStatus();

  const handleError = useCallback((error, customTitle) => {
    const message = getErrorMessage(error);
    toast({
      type: 'error',
      title: customTitle || 'Error',
      message
    });
    notifyError(message);
    return message;
  }, [notifyError, toast]);

  const handleErrorSilent = useCallback((error) => {
    return getErrorMessage(error);
  }, []);

  return { handleError, handleErrorSilent };
};

export default useApiError;
