// Дополняем существующие типы
export type UserRole = 
  | 'resident' 
  | 'dispatcher' 
  | 'technical_director' 
  | 'quality_inspector' 
  | 'technician' 
  | 'accountant' 
  | 'financial_director' 
  | 'main_director' 
  | 'security_guard'; 

export interface TechnicalReport {
  id: string;
  deviceId: string;
  deviceName: string;
  startDate: string;
  malfunctions: boolean;
  malfunctionDetails?: string;
  residualResource: number;
  generatedBy: string;
  generatedAt: string;
}

export interface WorkReport {
  id: string;
  taskNumber: string;
  requestNumber?: string;
  employee: string;
  task: string;
  result: string;
  executionTime: string;
  period: {
    start: string;
    end: string;
  };
  generatedBy: string;
  generatedAt: string;
}

export interface Request {
  id: string;
  userId: string;
  userFio: string;
  userApartment?: string;
  theme: string;
  description: string;
  status: 'created' | 'processing' | 'in_progress' | 'completed' | 'rejected';
  priority: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  assignedSpecialist?: string;
  createdAt: string;
  updatedAt: string;
  rejectedReason?: string;
  dispatcherId?: string;
  technicalDirectorId?: string;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  streamUrl?: string;
}

export interface SecuritySystem {
  id: string;
  type: 'lock' | 'alarm';
  status: 'armed' | 'disarmed' | 'triggered';
  location: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  recipient: string; // ID пользователя или 'all' для всех
  sender: string; // ID отправителя
  type: 'system' | 'message' | 'request' | 'emergency';
  sentAt: string;
  read: boolean;
  data?: any; // Дополнительные данные
}

export interface User {
  id: string;
  login: string;
  password: string;
  role: UserRole;
  name: string;
  passport: string;
  email: string;
  phone: string;
  apartment?: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface CounterReading {
  id: string;
  userId: string;
  userFio: string;
  userApartment: string;
  counterType: 'electricity' | 'electricity_day' | 'electricity_night' | 'hot_water' | 'cold_water';
  readings: number;
  period: string; // Месяц/год в формате "ММ.ГГГГ"
  submittedAt: string;
  status: 'submitted' | 'verified' | 'rejected';
}

export interface WorkData {
  id: string;
  requestId?: string;
  taskNumber: string;
  employee: string;
  task: string;
  result: string;
  executionTime: string;
  cost: number;
  period: {
    start: string;
    end: string;
  };
  materialsUsed?: string;
  createdAt: string;
}

export interface FinancialData {
  id: string;
  period: string; // "ММ.ГГГГ"
  income: number; // Доходы от жильцов
  expenses: number; // Общие расходы
  payroll: number; // ФОТ
  materials: number; // Материалы
  utilities: number; // Коммунальные услуги
  maintenance: number; // Техобслуживание
  profit: number; // Прибыль
  budget: number; // План
  deviation: number; // Отклонение от плана
}

export interface Budget {
  id: string;
  year: number;
  month: number;
  category: string;
  planned: number;
  actual: number;
  status: 'on_track' | 'exceeded' | 'under_used';
}