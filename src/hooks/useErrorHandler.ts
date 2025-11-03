import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addError } from '../store/errorSlice';
import { AppError } from '../types/errors';
import { createAppError } from '../utils/errors';

export const useErrorHandler = () => {
  const dispatch = useDispatch();

  const handleError = useCallback((error: any, context?: string) => {
    const appError = createAppError(error);
    
    if (context) {
      appError.message = `${context}: ${appError.message}`;
    }

    console.error('Error handled:', appError);
    dispatch(addError(appError));

    return appError;
  }, [dispatch]);

  const handleAsyncError = useCallback(async <T>(
    promise: Promise<T>,
    context?: string
  ): Promise<T> => {
    try {
      return await promise;
    } catch (error) {
      throw handleError(error, context);
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
};