import { AppError, ValidationError, ApiError, ErrorCode } from '../types/errors';

export class NetworkError extends Error {
  public code: ErrorCode = 'NETWORK_ERROR';
  
  constructor(message: string = 'Ошибка сети. Проверьте подключение к интернету.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends Error {
  public code: ErrorCode = 'UNAUTHORIZED';
  
  constructor(message: string = 'Необходима авторизация.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

// ИЗМЕНИТЕ ЭТОТ КЛАСС - переименуйте его
export class FormValidationError extends Error {
  public code: ErrorCode = 'VALIDATION_ERROR';
  public errors: ValidationError[];
  
  constructor(errors: ValidationError[], message: string = 'Ошибка валидации данных.') {
    super(message);
    this.name = 'FormValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends Error {
  public code: ErrorCode = 'NOT_FOUND';
  
  constructor(resource: string = 'Ресурс') {
    super(`${resource} не найден.`);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error {
  public code: ErrorCode = 'SERVER_ERROR';
  
  constructor(message: string = 'Внутренняя ошибка сервера.') {
    super(message);
    this.name = 'ServerError';
  }
}

export class TimeoutError extends Error {
  public code: ErrorCode = 'TIMEOUT_ERROR';
  
  constructor(message: string = 'Превышено время ожидания ответа.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export const createAppError = (error: any): AppError => {
  if (error instanceof NetworkError) {
    return {
      code: error.code,
      message: error.message,
      timestamp: new Date(),
    };
  }
  
  if (error instanceof UnauthorizedError) {
    return {
      code: error.code,
      message: error.message,
      timestamp: new Date(),
    };
  }
  
  // ОБНОВИТЕ ЭТУ СТРОКУ:
  if (error instanceof FormValidationError) {
    return {
      code: error.code,
      message: error.message,
      details: error.errors,
      timestamp: new Date(),
    };
  }
  
  // Обработка API ошибок
  if (error.response) {
    const apiError: ApiError = error.response;
    
    switch (apiError.status) {
      case 400:
        return {
          code: 'VALIDATION_ERROR',
          message: apiError.data?.message || 'Неверные данные запроса.',
          details: apiError.data?.errors,
          timestamp: new Date(),
        };
      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: apiError.data?.message || 'Необходима авторизация.',
          timestamp: new Date(),
        };
      case 403:
        return {
          code: 'FORBIDDEN',
          message: apiError.data?.message || 'Доступ запрещен.',
          timestamp: new Date(),
        };
      case 404:
        return {
          code: 'NOT_FOUND',
          message: apiError.data?.message || 'Ресурс не найден.',
          timestamp: new Date(),
        };
      case 500:
        return {
          code: 'SERVER_ERROR',
          message: apiError.data?.message || 'Внутренняя ошибка сервера.',
          timestamp: new Date(),
        };
      default:
        return {
          code: 'UNKNOWN_ERROR',
          message: `Ошибка ${apiError.status}: ${apiError.statusText}`,
          timestamp: new Date(),
        };
    }
  }
  
  // Ошибки сети
  if (error.request) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Ошибка сети. Проверьте подключение к интернету.',
      timestamp: new Date(),
    };
  }
  
  // Неизвестные ошибки
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'Произошла неизвестная ошибка.',
    timestamp: new Date(),
  };
};