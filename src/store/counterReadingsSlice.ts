import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CounterReading } from '../types';

interface CounterReadingsState {
  readings: CounterReading[];
  loading: boolean;
}

const initialState: CounterReadingsState = {
    readings: [
      {
        id: 'CR-TEST-1',
        userId: '1',
        userFio: 'Тестовый Жилец',
        userApartment: '100',
        counterType: 'electricity',
        readings: 100,
        period: '11.2024',
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }
    ],
    loading: false,
  };

const counterReadingsSlice = createSlice({
    name: 'counterReadings',
    initialState,
    reducers: {
      submitReading: (state, action: PayloadAction<Omit<CounterReading, 'id' | 'submittedAt' | 'status'>>) => {
        // ДЕБАГ: логируем в редьюсере
        console.log('🎯 REDUCER: submitReading called with:', action.payload);
        
        const newReading: CounterReading = {
          id: `CR-${Date.now()}`,
          ...action.payload,
          submittedAt: new Date().toISOString(),
          status: 'submitted'
        };
        
        console.log('📝 REDUCER: New reading created:', newReading);
        console.log('📊 REDUCER: State before:', state.readings.length, 'readings');
        
        state.readings.unshift(newReading);
        
        console.log('✅ REDUCER: State after:', state.readings.length, 'readings');
        console.log('📋 REDUCER: All readings:', state.readings);
      },
      // ... остальные редьюсеры
    updateReadingStatus: (state, action: PayloadAction<{ id: string; status: 'verified' | 'rejected' }>) => {
      const reading = state.readings.find(r => r.id === action.payload.id);
      if (reading) {
        reading.status = action.payload.status;
      }
    },
    // Для демо - заполнить начальными данными
    setDemoReadings: (state, action: PayloadAction<CounterReading[]>) => {
      state.readings = action.payload;
    }
  },
});

export const { submitReading, updateReadingStatus, setDemoReadings } = counterReadingsSlice.actions;
export default counterReadingsSlice.reducer;