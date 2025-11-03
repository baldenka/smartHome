import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Request } from '../types';

interface RequestsState {
  requests: Request[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  requests: [
    {
      id: 'REQ-001',
      userId: '1',
      userFio: 'Иванов Иван Иванович',
      userApartment: '1410',
      theme: 'Протечка в ванной комнате',
      description: 'В ванной комнате на потолке появились пятна влаги, капает вода из стыка между стеной и потолком',
      status: 'created',
      priority: 0, // Приоритет 0 = не назначен
      createdAt: '2024-11-15T14:30:00',
      updatedAt: '2024-11-15T14:30:00',
    },
    {
      id: 'REQ-002',
      userId: '2',
      userFio: 'Петрова Анна Сергеевна',
      userApartment: '1320',
      theme: 'Не работает домофон',
      description: 'Домофон в подъезде 2 не реагирует на нажатия кнопок вызова',
      status: 'processing', // Направлена техническому директору
      priority: 0, // Еще без приоритета
      dispatcherId: '2',
      createdAt: '2024-11-14T10:15:00',
      updatedAt: '2024-11-14T11:20:00',
    },
    {
      id: 'REQ-003',
      userId: '3',
      userFio: 'Сидоров Алексей Владимирович',
      userApartment: '45',
      theme: 'Сломанный радиатор',
      description: 'В квартире 45 не греет радиатор в гостиной',
      status: 'in_progress', // Назначена приоритет и специалист
      priority: 2, // Теперь есть приоритет
      assignedSpecialist: 'Иванов А.Б.',
      dispatcherId: '2',
      technicalDirectorId: '3',
      createdAt: '2024-11-13T09:20:00',
      updatedAt: '2024-11-13T14:30:00',
    },
    {
      id: 'REQ-004',
      userId: '4',
      userFio: 'Козлова Мария Дмитриевна',
      userApartment: '103',
      theme: 'Замена лампочки в подъезде',
      description: 'В подъезде 3 на 5 этаже перегорела лампочка',
      status: 'completed',
      priority: 4,
      assignedSpecialist: 'Петров В.Г.',
      dispatcherId: '2',
      technicalDirectorId: '3',
      createdAt: '2024-11-10T16:45:00',
      updatedAt: '2024-11-11T10:15:00',
    }
  ],
  loading: false,
  error: null,
};

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    createRequest: (state, action: PayloadAction<{ 
      theme: string; 
      description: string; 
      userId: string;
      userFio: string;
      userApartment?: string;
    }>) => {
      const newRequest: Request = {
        id: `REQ-${Date.now()}`,
        ...action.payload,
        status: 'created',
        priority: 0, // Приоритет 0 = не назначен
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.requests.unshift(newRequest);
    },
    
    // Диспетчер направляет заявку техническому директору (БЕЗ приоритета)
    sendToTechnicalDirector: (state, action: PayloadAction<{ 
      id: string; 
      dispatcherId: string;
    }>) => {
      const request = state.requests.find(r => r.id === action.payload.id);
      if (request) {
        request.status = 'processing';
        request.dispatcherId = action.payload.dispatcherId;
        request.updatedAt = new Date().toISOString();
        // Приоритет остается 0 - его назначит технический директор
      }
    },
    
    // Диспетчер отклоняет заявку (БЕЗ приоритета)
    rejectRequest: (state, action: PayloadAction<{ 
      id: string; 
      rejectedReason: string;
      dispatcherId: string;
    }>) => {
      const request = state.requests.find(r => r.id === action.payload.id);
      if (request) {
        request.status = 'rejected';
        request.rejectedReason = action.payload.rejectedReason;
        request.dispatcherId = action.payload.dispatcherId;
        request.updatedAt = new Date().toISOString();
        // Приоритет остается 0
      }
    },
    
    // Технический директор назначает приоритет и специалиста (ЗДЕСЬ назначается приоритет)
    assignRequest: (state, action: PayloadAction<{ 
      id: string; 
      priority: 1 | 2 | 3 | 4 | 5 | 6 | 7; // Теперь назначается приоритет
      assignedSpecialist: string;
      technicalDirectorId: string;
    }>) => {
      const request = state.requests.find(r => r.id === action.payload.id);
      if (request) {
        request.status = 'in_progress';
        request.priority = action.payload.priority; // Назначаем приоритет
        request.assignedSpecialist = action.payload.assignedSpecialist;
        request.technicalDirectorId = action.payload.technicalDirectorId;
        request.updatedAt = new Date().toISOString();
      }
    },
    
    // Завершение заявки
    completeRequest: (state, action: PayloadAction<{ id: string }>) => {
      const request = state.requests.find(r => r.id === action.payload.id);
      if (request) {
        request.status = 'completed';
        request.updatedAt = new Date().toISOString();
      }
    },
    
    resetToDemo: (state) => {
      state.requests = initialState.requests;
    },
  },
});

export const { 
  createRequest, 
  sendToTechnicalDirector,
  rejectRequest, 
  assignRequest, 
  completeRequest,
  resetToDemo 
} = requestsSlice.actions;

export default requestsSlice.reducer;