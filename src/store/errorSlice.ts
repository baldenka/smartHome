import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppError } from '../types/errors';

interface ErrorState {
  errors: AppError[];
  lastError: AppError | null;
}

const initialState: ErrorState = {
  errors: [],
  lastError: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<AppError>) => {
      state.errors.push(action.payload);
      state.lastError = action.payload;
      
      // Ограничиваем историю ошибок последними 10
      if (state.errors.length > 10) {
        state.errors = state.errors.slice(-10);
      }
    },
    clearError: (state, action: PayloadAction<string>) => {
      state.errors = state.errors.filter(error => error.code !== action.payload);
      if (state.lastError?.code === action.payload) {
        state.lastError = null;
      }
    },
    clearAllErrors: (state) => {
      state.errors = [];
      state.lastError = null;
    },
    clearLastError: (state) => {
      state.lastError = null;
    },
  },
});

export const { addError, clearError, clearAllErrors, clearLastError } = errorSlice.actions;
export default errorSlice.reducer;