import { configureStore } from '@reduxjs/toolkit';
import counterReadingsReducer from './counterReadingsSlice';
import authReducer from './authSlice';
import requestsReducer from './requestsSlice';
import devicesReducer from './devicesSlice';
import errorReducer from './errorSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    devices: devicesReducer,
    error: errorReducer,
    notifications: notificationsReducer, 
    counterReadings: counterReadingsReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;