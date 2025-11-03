import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, AppError, UserRole } from '../types/index';
import { createAppError } from '../utils/errors';
export type UserWithoutPassword = Omit<User, 'password'>;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AppError | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const demoUsers: Record<string, User> = {
  resident: {
    id: '1',
    login: 'resident',
    password: '123',
    role: 'resident',
    name: 'Иванов Иван Иванович',
    passport: '4510123456',
    email: 'resident@example.com',
    phone: '+79001234567',
  },
  dispatcher: {
    id: '2',
    login: 'dispatcher',
    password: '123',
    role: 'dispatcher',
    name: 'Петрова Анна Сергеевна',
    passport: '4510987654',
    email: 'dispatcher@uk-dubrovka.ru',
    phone: '+79007654321',
  },
  technical_director: {
    id: '3',
    login: 'director',
    password: '123',
    role: 'technical_director',
    name: 'Сидоров Алексей Владимирович',
    passport: '4510567890',
    email: 'director@uk-dubrovka.ru',
    phone: '+79005556677',
  },
  quality_inspector: {
    id: '5',
    login: 'inspector',
    password: '123',
    role: 'quality_inspector',
    name: 'Козлова Мария Дмитриевна',
    passport: '4510234567',
    email: 'inspector@uk-dubrovka.ru',
    phone: '+79003334455',
  },
  technician: {
    id: '6',
    login: 'technician',
    password: '123',
    role: 'technician',
    name: 'Николаев Сергей Петрович',
    passport: '4510456789',
    email: 'technician@uk-dubrovka.ru',
    phone: '+79004445566',
  },
  accountant: {
    id: '7',
    login: 'accountant',
    password: '123',
    role: 'accountant',
    name: 'Федорова Ольга Ивановна',
    passport: '4510678901',
    email: 'accountant@uk-dubrovka.ru',
    phone: '+79007778899',
  },
  financial_director: {
    id: '8',
    login: 'financial',
    password: '123',
    role: 'financial_director',
    name: 'Громов Денис Викторович',
    passport: '4510890123',
    email: 'financial@uk-dubrovka.ru',
    phone: '+79008889900',
  },
  main_director: {
    id: '9',
    login: 'main',
    password: '123',
    role: 'main_director',
    name: 'Волков Артем Сергеевич',
    passport: '4510012345',
    email: 'main@uk-dubrovka.ru',
    phone: '+79009990011',
  },
  security_guard: {
    id: '4',
    login: 'security',
    password: '123',
    role: 'security_guard',
    name: 'Козлов Дмитрий Петрович',
    passport: '4510345678',
    email: 'security@uk-dubrovka.ru',
    phone: '+79008889900',
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }, { rejectWithValue }) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = Object.values(demoUsers).find(
            u => u.login === credentials.login && u.password === credentials.password
          );
          
          if (user) {
            // Создаем копию пользователя без пароля
            const userWithoutPassword: User = {
              id: user.id,
              login: user.login,
              role: user.role,
              name: user.name,
              passport: user.passport,
              email: user.email,
              phone: user.phone,
              apartment: user.apartment,
              password: '',
            };
            
            resolve({
              // @ts-ignore
              user: userWithoutPassword 
            });
          } else {
            reject(new Error('Неверный логин или пароль'));
          }
        }, 1000);
      });
    } catch (error) {
      return rejectWithValue(createAppError(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Дополнительный action для быстрой смены роли (удобно для демо)
    switchRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: any) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, switchRole } = authSlice.actions;
export default authSlice.reducer;