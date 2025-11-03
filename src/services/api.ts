import axios, { AxiosError, AxiosResponse } from 'axios';
import { createAppError, NetworkError, TimeoutError } from '../utils/errors';
import { AppError } from '../types/errors';

const API_BASE_URL = 'https://api.uk-dubrovka.ru';
const TIMEOUT = 10000;

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(createAppError(error));
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const appError = createAppError(error);
    return Promise.reject(appError);
  }
);

// Обертка для всех API вызовов с обработкой ошибок
const apiCall = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw createAppError(error);
  }
};

export const authAPI = {
  login: (credentials: { login: string; password: string }) =>
    apiCall(api.post('/auth/login', credentials)),
  
  refreshToken: () => 
    apiCall(api.post('/auth/refresh')),
  
  logout: () => 
    apiCall(api.post('/auth/logout')),
};

export const requestsAPI = {
  create: (request: { theme: string; description: string }) =>
    apiCall(api.post('/requests', request)),
  
  getMyRequests: () => 
    apiCall(api.get('/requests/my')),
  
  getAll: (filters?: any) => 
    apiCall(api.get('/requests', { params: filters })),
  
  getById: (id: string) => 
    apiCall(api.get(`/requests/${id}`)),
  
  updateStatus: (id: string, status: string, reason?: string) =>
    apiCall(api.patch(`/requests/${id}/status`, { status, reason })),
  
  assign: (id: string, data: { priority: number; assignedTo: string }) =>
    apiCall(api.patch(`/requests/${id}/assign`, data)),
};

export const countersAPI = {
  submitReadings: (readings: any) =>
    apiCall(api.post('/counters/readings', readings)),
  
  getMyReadings: () => 
    apiCall(api.get('/counters/readings/my')),
  
  getReadingsHistory: (period: { start: string; end: string }) =>
    apiCall(api.get('/counters/readings/history', { params: period })),
};

export const devicesAPI = {
  getDevices: (type?: string) => 
    apiCall(api.get('/devices', { params: { type } })),
  
  getDeviceStatus: (deviceId: string) => 
    apiCall(api.get(`/devices/${deviceId}`)),
  
  updateDeviceStatus: (deviceId: string, status: string) =>
    apiCall(api.patch(`/devices/${deviceId}/status`, { status })),
  
  getDeviceTypes: () => 
    apiCall(api.get('/devices/types')),
};

export const reportsAPI = {
  generateWorkReport: (data: any) =>
    apiCall(api.post('/reports/work', data)),
  
  generateTechnicalReport: (data: any) =>
    apiCall(api.post('/reports/technical', data)),
  
  getReports: (type: string, period?: { start: string; end: string }) =>
    apiCall(api.get('/reports', { params: { type, ...period } })),
  
  downloadReport: (reportId: string) =>
    apiCall(api.get(`/reports/${reportId}/download`, { responseType: 'blob' })),
};

export const notificationsAPI = {
  getNotifications: () => 
    apiCall(api.get('/notifications')),
  
  markAsRead: (notificationId: string) =>
    apiCall(api.patch(`/notifications/${notificationId}/read`)),
  
  sendNotification: (data: { recipient: string; title: string; message: string }) =>
    apiCall(api.post('/notifications', data)),
};

export default api;