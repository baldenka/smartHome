import { User, CounterReading, WorkData, Request} from '../types';

export const demoUsers: Record<string, User> = {
  resident: {
    id: '1',
    name: 'Иванов Иван Иванович',
    role: 'resident',
    email: 'resident@example.com',
    phone: '+79001234567',
    passport: '4510123456',
    login: 'resident',
    password: '123'
  },
  dispatcher: {
    id: '2',
    name: 'Петрова Анна Сергеевна',
    role: 'dispatcher',
    email: 'dispatcher@uk-dubrovka.ru',
    phone: '+79007654321',
    passport: '4510987654',
    login: 'dispatcher',
    password: '123'
  },
  technical_director: {
    id: '3',
    name: 'Сидоров Алексей Владимирович',
    role: 'technical_director',
    email: 'director@uk-dubrovka.ru',
    phone: '+79005556677',
    passport: '4510567890',
    login: 'director',
    password: '123'
  },
  quality_inspector: {
    id: '5',
    name: 'Козлова Мария Дмитриевна',
    role: 'quality_inspector',
    email: 'inspector@uk-dubrovka.ru',
    phone: '+79003334455',
    passport: '4510234567',
    login: 'inspector',
    password: '123'
  },
  technician: {
    id: '6',
    name: 'Николаев Сергей Петрович',
    role: 'technician',
    email: 'technician@uk-dubrovka.ru',
    phone: '+79004445566',
    passport: '4510456789',
    login: 'technician',
    password: '123'
  },
  accountant: {
    id: '7',
    name: 'Федорова Ольга Ивановна',
    role: 'accountant',
    email: 'accountant@uk-dubrovka.ru',
    phone: '+79007778899',
    passport: '4510678901',
    login: 'accountant',
    password: '123'
  },
  financial_director: {
    id: '8',
    name: 'Громов Денис Викторович',
    role: 'financial_director',
    email: 'financial@uk-dubrovka.ru',
    phone: '+79008889900',
    passport: '4510890123',
    login: 'financial',
    password: '123'
  },
  main_director: {
    id: '9',
    name: 'Волков Артем Сергеевич',
    role: 'main_director',
    email: 'main@uk-dubrovka.ru',
    phone: '+79009990011',
    passport: '4510012345',
    login: 'main',
    password: '123'
  },
  security_guard: {
    id: '4',
    name: 'Козлов Дмитрий Петрович',
    role: 'security_guard',
    email: 'security@uk-dubrovka.ru',
    phone: '+79008889900',
    passport: '4510345678',
    login: 'security',
    password: '123'
  }
};

export const demoPasswords: Record<string, string> = {
  resident: '123',
  dispatcher: '123', 
  technical_director: '123',
  quality_inspector: '123',
  technician: '123',
  accountant: '123',
  financial_director: '123',
  main_director: '123',
  security_guard: '123',
};


export interface Device {
  id: string;
  name: string;
  type: 'lock' | 'radiator' | 'water_meter' | 'electricity_meter' | 'camera' | 'motion_sensor' | 'light' | 'light_sensor' | 'temperature_sensor';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  installationDate: string;
  lastMaintenance?: string;
  batteryLevel?: number;
  specifications: {
    [key: string]: any;
  };
}

// Общая база данных всех устройств с уникальными ID
export const demoDevices: Device[] = [
  // Замки
  {
    id: 'lock-45654',
    name: 'Электронный замок подъезда 1',
    type: 'lock',
    status: 'online',
    location: 'Подъезд 1, этаж 1',
    installationDate: '15.03.2022',
    lastMaintenance: '11.03.2023',
    batteryLevel: 90,
    specifications: {
      status: 'blocked',
      lastUnlock: '11.03.2023 13:20:59',
      unauthorizedAttempts: 'отсут.',
      connection: 'отсут.'
    }
  },
  {
    id: 'lock-23456786',
    name: 'Электронный замок подъезда 2',
    type: 'lock',
    status: 'online',
    location: 'Подъезд 2, этаж 1',
    installationDate: '20.03.2022',
    lastMaintenance: '10.03.2023',
    batteryLevel: 34,
    specifications: {
      status: 'blocked',
      lastUnlock: '10.03.2023 23:00:39',
      unauthorizedAttempts: 'отсут.',
      connection: 'Wi-Fi'
    }
  },
  {
    id: 'lock-0987',
    name: 'Электронный замок подъезда 3',
    type: 'lock',
    status: 'online',
    location: 'Подъезд 3, этаж 1',
    installationDate: '25.03.2022',
    batteryLevel: 56,
    specifications: {
      status: 'unblocked',
      lastUnlock: '30.08.2023 10:10:10',
      unauthorizedAttempts: '30.08.2023 10:10:10',
      connection: 'Wi-Fi'
    }
  },

  // Радиаторы
  {
    id: 'radiator-3245',
    name: 'Радиатор отопления кв. 101',
    type: 'radiator',
    status: 'online',
    location: 'Квартира 101',
    installationDate: '01.10.2021',
    specifications: {
      status: 'on',
      temperature: 33,
      scenario: 'авто. темп',
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },
  {
    id: 'radiator-765432',
    name: 'Радиатор отопления кв. 102',
    type: 'radiator',
    status: 'online',
    location: 'Квартира 102',
    installationDate: '01.10.2021',
    specifications: {
      status: 'on',
      temperature: 25,
      scenario: 'авто. темп',
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },

  // Счетчики воды
  {
    id: 'water-3245',
    name: 'Счетчик горячей воды кв. 101',
    type: 'water_meter',
    status: 'online',
    location: 'Квартира 101',
    installationDate: '15.09.2021',
    specifications: {
      status: 'on',
      currentFlow: 33,
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },
  {
    id: 'water-765432',
    name: 'Счетчик холодной воды кв. 102',
    type: 'water_meter',
    status: 'online',
    location: 'Квартира 102',
    installationDate: '15.09.2021',
    specifications: {
      status: 'on',
      currentFlow: 25,
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },

  // Счетчики электричества
  {
    id: 'electricity-3245',
    name: 'Электросчетчик кв. 101',
    type: 'electricity_meter',
    status: 'online',
    location: 'Квартира 101',
    installationDate: '10.09.2021',
    specifications: {
      status: 'on',
      readings: 33,
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },
  {
    id: 'electricity-765432',
    name: 'Электросчетчик кв. 102',
    type: 'electricity_meter',
    status: 'online',
    location: 'Квартира 102',
    installationDate: '10.09.2021',
    specifications: {
      status: 'on',
      readings: 25,
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },

  // Камеры
  {
    id: 'camera-01',
    name: 'Камера наблюдения входная',
    type: 'camera',
    status: 'online',
    location: 'Главный вход',
    installationDate: '20.08.2021',
    specifications: {
      status: 'on',
      recording: 'идет',
      resolution: '1080p',
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },
  {
    id: 'camera-02',
    name: 'Камера наблюдения двор',
    type: 'camera',
    status: 'online',
    location: 'Двор',
    installationDate: '20.08.2021',
    specifications: {
      status: 'on',
      recording: 'идет',
      resolution: '1080p',
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },

  // Датчики движения
  {
    id: 'motion-01',
    name: 'Датчик движения подъезд 1',
    type: 'motion_sensor',
    status: 'online',
    location: 'Подъезд 1, 1 этаж',
    installationDate: '05.11.2021',
    batteryLevel: 100,
    specifications: {
      status: 'on',
      sensitivity: 2,
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },
  {
    id: 'motion-02',
    name: 'Датчик движения подъезд 2',
    type: 'motion_sensor',
    status: 'online',
    location: 'Подъезд 2, 1 этаж',
    installationDate: '05.11.2021',
    batteryLevel: 50,
    specifications: {
      status: 'on',
      sensitivity: 4,
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },

  // Лампочки
  {
    id: 'light-434',
    name: 'Умная лампа подъезд 1',
    type: 'light',
    status: 'offline',
    location: 'Подъезд 1, 1 этаж',
    installationDate: '12.12.2021',
    batteryLevel: 100,
    specifications: {
      status: 'off',
      motionSensor1: '567',
      motionSensor2: '1',
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },
  {
    id: 'light-765',
    name: 'Умная лампа подъезд 2',
    type: 'light',
    status: 'online',
    location: 'Подъезд 2, 1 этаж',
    installationDate: '12.12.2021',
    batteryLevel: 50,
    specifications: {
      status: 'on',
      motionSensor1: '34567',
      motionSensor2: '543',
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },

  // Датчики освещения
  {
    id: 'light-sensor-01',
    name: 'Датчик освещения двор',
    type: 'light_sensor',
    status: 'online',
    location: 'Двор, восточная сторона',
    installationDate: '08.10.2021',
    batteryLevel: 100,
    specifications: {
      status: 'on',
      sensitivity: 2,
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },
  {
    id: 'light-sensor-02',
    name: 'Датчик освещения парковка',
    type: 'light_sensor',
    status: 'online',
    location: 'Парковка, северная сторона',
    installationDate: '08.10.2021',
    batteryLevel: 80,
    specifications: {
      status: 'on',
      sensitivity: 3,
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  },

  // Датчики температуры
  {
    id: 'temp-01',
    name: 'Датчик температуры подъезд 1',
    type: 'temperature_sensor',
    status: 'online',
    location: 'Подъезд 1, 1 этаж',
    installationDate: '03.09.2021',
    batteryLevel: 100,
    specifications: {
      status: 'on',
      sensitivity: 2,
      failures: 'отсут.',
      connection: 'отсут.'
    }
  },
  {
    id: 'temp-02',
    name: 'Датчик температуры подъезд 2',
    type: 'temperature_sensor',
    status: 'online',
    location: 'Подъезд 2, 1 этаж',
    installationDate: '03.09.2021',
    batteryLevel: 85,
    specifications: {
      status: 'on',
      sensitivity: 2,
      failures: 'отсут.',
      connection: 'Wi-Fi'
    }
  }
];

// Группировка устройств по типам для удобства
export const getDevicesByType = (type: Device['type']) => {
  return demoDevices.filter(device => device.type === type);
};

export const getAllDeviceTypes = () => {
  return Array.from(new Set(demoDevices.map(device => device.type)));
};

export const demoCounterReadings: CounterReading[] = [
  {
    id: 'CR-001',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'electricity',
    readings: 791,
    period: '11.2024',
    submittedAt: '2024-11-15T10:30:00',
    status: 'verified'
  },
  {
    id: 'CR-002',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'electricity_day',
    readings: 450,
    period: '11.2024',
    submittedAt: '2024-11-15T10:30:00',
    status: 'verified'
  },
  {
    id: 'CR-003',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'electricity_night',
    readings: 341,
    period: '11.2024',
    submittedAt: '2024-11-15T10:30:00',
    status: 'verified'
  },
  {
    id: 'CR-004',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'hot_water',
    readings: 12.5,
    period: '11.2024',
    submittedAt: '2024-11-15T10:30:00',
    status: 'verified'
  },
  {
    id: 'CR-005',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'cold_water',
    readings: 18.3,
    period: '11.2024',
    submittedAt: '2024-11-15T10:30:00',
    status: 'verified'
  },
  {
    id: 'CR-006',
    userId: '10',
    userFio: 'Семенов Андрей Викторович',
    userApartment: '1320',
    counterType: 'electricity',
    readings: 645,
    period: '11.2024',
    submittedAt: '2024-11-14T14:20:00',
    status: 'verified'
  },
  {
    id: 'CR-007',
    userId: '10',
    userFio: 'Семенов Андрей Викторович',
    userApartment: '1320',
    counterType: 'hot_water',
    readings: 8.7,
    period: '11.2024',
    submittedAt: '2024-11-14T14:20:00',
    status: 'submitted'
  },
  {
    id: 'CR-008',
    userId: '10',
    userFio: 'Семенов Андрей Викторович',
    userApartment: '1320',
    counterType: 'cold_water',
    readings: 15.2,
    period: '11.2024',
    submittedAt: '2024-11-14T14:20:00',
    status: 'submitted'
  },
  {
    id: 'CR-009',
    userId: '11',
    userFio: 'Смирнова Виктория Игоревна',
    userApartment: '103',
    counterType: 'electricity',
    readings: 543,
    period: '11.2024',
    submittedAt: '2024-11-13T09:15:00',
    status: 'verified'
  },
  {
    id: 'CR-010',
    userId: '11',
    userFio: 'Смирнова Виктория Игоревна',
    userApartment: '103',
    counterType: 'hot_water',
    readings: 6.3,
    period: '11.2024',
    submittedAt: '2024-11-13T09:15:00',
    status: 'verified'
  },
  {
    id: 'CR-011',
    userId: '11',
    userFio: 'Смирнова Виктория Игоревна',
    userApartment: '103',
    counterType: 'cold_water',
    readings: 12.8,
    period: '11.2024',
    submittedAt: '2024-11-13T09:15:00',
    status: 'verified'
  },
  // Добавляем данные за предыдущие месяцы для аналитики
  {
    id: 'CR-012',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'electricity',
    readings: 720,
    period: '10.2024',
    submittedAt: '2024-10-15T10:30:00',
    status: 'verified'
  },
  {
    id: 'CR-013',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    counterType: 'electricity',
    readings: 690,
    period: '09.2024',
    submittedAt: '2024-09-15T10:30:00',
    status: 'verified'
  }
];

export const demoRequests: Request[] = [
  {
    id: 'REQ-001',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    theme: 'Протечка в ванной комнате',
    description: 'В ванной комнате на потолке появились пятна влаги, капает вода из стыка между стеной и потолком',
    status: 'completed',
    priority: 2,
    assignedSpecialist: 'Иванов А.Б.',
    createdAt: '2024-11-15T14:30:00',
    updatedAt: '2024-11-15T17:30:00',
    dispatcherId: '2',
    technicalDirectorId: '3'
  },
  {
    id: 'REQ-002',
    userId: '10',
    userFio: 'Семенов Андрей Викторович',
    userApartment: '1320',
    theme: 'Не работает домофон',
    description: 'Домофон в подъезде 2 не реагирует на нажатия кнопок вызова',
    status: 'in_progress',
    priority: 1,
    assignedSpecialist: 'Петров В.Г.',
    createdAt: '2024-11-14T10:15:00',
    updatedAt: '2024-11-14T11:20:00',
    dispatcherId: '2',
    technicalDirectorId: '3'
  },
  {
    id: 'REQ-003',
    userId: '11',
    userFio: 'Смирнова Виктория Игоревна',
    userApartment: '103',
    theme: 'Сломанный радиатор',
    description: 'В квартире 103 не греет радиатор в гостиной',
    status: 'processing',
    priority: 0,
    createdAt: '2024-11-13T09:20:00',
    updatedAt: '2024-11-13T09:20:00',
    dispatcherId: '2'
  },
  {
    id: 'REQ-004',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    theme: 'Замена лампочки в подъезде',
    description: 'В подъезде 3 на 5 этаже перегорела лампочка',
    status: 'completed',
    priority: 4,
    assignedSpecialist: 'Сидоров Д.Е.',
    createdAt: '2024-11-10T16:45:00',
    updatedAt: '2024-11-11T10:15:00',
    dispatcherId: '2',
    technicalDirectorId: '3'
  },
  {
    id: 'REQ-005',
    userId: '10',
    userFio: 'Семенов Андрей Викторович',
    userApartment: '1320',
    theme: 'Шум в системе вентиляции',
    description: 'В ванной комнате слышен постоянный шум из вентиляционной системы',
    status: 'created',
    priority: 0,
    createdAt: '2024-11-16T08:30:00',
    updatedAt: '2024-11-16T08:30:00'
  },
  {
    id: 'REQ-006',
    userId: '11',
    userFio: 'Смирнова Виктория Игоревна',
    userApartment: '103',
    theme: 'Неисправность кондиционера',
    description: 'Кондиционер в спальне не включается, на пульте мигает красный индикатор',
    status: 'in_progress',
    priority: 3,
    assignedSpecialist: 'Козлов М.Н.',
    createdAt: '2024-11-12T14:20:00',
    updatedAt: '2024-11-13T15:40:00',
    dispatcherId: '2',
    technicalDirectorId: '3'
  },
  {
    id: 'REQ-007',
    userId: '1',
    userFio: 'Иванов Иван Иванович',
    userApartment: '1410',
    theme: 'Протечка на кухне',
    description: 'Под раковиной на кухне постоянная течь, вода капает на пол',
    status: 'rejected',
    priority: 0,
    rejectedReason: 'Недостаточно информации для обработки заявки',
    createdAt: '2024-11-09T11:10:00',
    updatedAt: '2024-11-09T12:30:00',
    dispatcherId: '2'
  }
];

export const demoWorkData: WorkData[] = [
  {
    id: 'WD-001',
    requestId: 'REQ-001',
    taskNumber: 'TASK-2024-001',
    employee: 'Иванов А.Б.',
    task: 'Устранение протечки в ванной комнате',
    result: 'Протечка устранена, заменен участок трубы',
    executionTime: '3 часа',
    cost: 2500,
    period: {
      start: '2024-11-15',
      end: '2024-11-15'
    },
    materialsUsed: 'Труба ПВХ 20мм - 2м, фитинги - 4шт',
    createdAt: '2024-11-15T16:00:00'
  },
  {
    id: 'WD-002',
    requestId: 'REQ-002',
    taskNumber: 'TASK-2024-002',
    employee: 'Петров В.Г.',
    task: 'Ремонт домофона в подъезде 2',
    result: 'Домофон отремонтирован, заменен блок управления',
    executionTime: '2 часа',
    cost: 1800,
    period: {
      start: '2024-11-14',
      end: '2024-11-14'
    },
    materialsUsed: 'Блок управления домофона - 1шт',
    createdAt: '2024-11-14T15:30:00'
  },
  {
    id: 'WD-003',
    taskNumber: 'TASK-2024-003',
    employee: 'Сидоров Д.Е.',
    task: 'Плановое обслуживание системы отопления',
    result: 'Система проверена, проблем не обнаружено',
    executionTime: '4 часа',
    cost: 3200,
    period: {
      start: '2024-11-10',
      end: '2024-11-10'
    },
    materialsUsed: 'Не требуется',
    createdAt: '2024-11-10T18:00:00'
  },
  {
    id: 'WD-004',
    requestId: 'REQ-004',
    taskNumber: 'TASK-2024-004',
    employee: 'Козлов М.Н.',
    task: 'Замена неисправного радиатора',
    result: 'Радиатор заменен, система отопления работает нормально',
    executionTime: '5 часов',
    cost: 4200,
    period: {
      start: '2024-11-13',
      end: '2024-11-13'
    },
    materialsUsed: 'Радиатор биметаллический - 1шт, кронштейны - 4шт',
    createdAt: '2024-11-13T17:45:00'
  },
  {
    id: 'WD-005',
    taskNumber: 'TASK-2024-005',
    employee: 'Николаев С.П.',
    task: 'Обслуживание систем видеонаблюдения',
    result: 'Все камеры проверены, прошивка обновлена',
    executionTime: '6 часов',
    cost: 2800,
    period: {
      start: '2024-11-08',
      end: '2024-11-08'
    },
    materialsUsed: 'Кабели соединения - 10м',
    createdAt: '2024-11-08T19:20:00'
  },
  // Добавляем работы за предыдущие месяцы
  {
    id: 'WD-006',
    taskNumber: 'TASK-2024-006',
    employee: 'Иванов А.Б.',
    task: 'Ремонт системы вентиляции',
    result: 'Система вентиляции отремонтирована, заменены фильтры',
    executionTime: '3.5 часа',
    cost: 3100,
    period: {
      start: '2024-10-20',
      end: '2024-10-20'
    },
    materialsUsed: 'Фильтры вентиляции - 2шт',
    createdAt: '2024-10-20T16:30:00'
  },
  {
    id: 'WD-007',
    taskNumber: 'TASK-2024-007',
    employee: 'Петров В.Г.',
    task: 'Настройка системы умного дома',
    result: 'Система настроена, все датчики работают корректно',
    executionTime: '2 часа',
    cost: 1500,
    period: {
      start: '2024-10-15',
      end: '2024-10-15'
    },
    materialsUsed: 'Не требуется',
    createdAt: '2024-10-15T14:00:00'
  },
  {
    id: 'WD-008',
    taskNumber: 'TASK-2024-008',
    employee: 'Сидоров Д.Е.',
    task: 'Замена освещения в подъездах',
    result: 'Все лампы заменены, освещение работает',
    executionTime: '4 часа',
    cost: 2800,
    period: {
      start: '2024-09-25',
      end: '2024-09-25'
    },
    materialsUsed: 'LED лампы - 24шт',
    createdAt: '2024-09-25T18:45:00'
  }
];

export const getUsersByRole = (role: string) => {
  return Object.values(demoUsers).filter(user => user.role === role);
};

export const getRequestsByStatus = (status: string) => {
  return demoRequests.filter(request => request.status === status);
};

export const getWorkDataByPeriod = (startDate: string, endDate: string) => {
  return demoWorkData.filter(work => 
    work.period.start >= startDate && work.period.end <= endDate
  );
};

export const getCounterReadingsByPeriod = (period: string) => {
  return demoCounterReadings.filter(reading => reading.period === period);
};

export const getSystemStats = () => {
  return {
    totalUsers: Object.values(demoUsers).length,
    totalDevices: demoDevices.length,
    onlineDevices: demoDevices.filter(d => d.status === 'online').length,
    totalRequests: demoRequests.length,
    completedRequests: demoRequests.filter(r => r.status === 'completed').length,
    totalWorkCost: demoWorkData.reduce((sum, work) => sum + work.cost, 0),
    totalReadings: demoCounterReadings.length,
    verifiedReadings: demoCounterReadings.filter(r => r.status === 'verified').length
  };
};
