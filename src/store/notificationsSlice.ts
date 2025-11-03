import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, UserRole } from '../types';

interface NotificationsState {
  notifications: Notification[];
}

// Демо-уведомления согласно ролям из ТЗ
const demoNotifications: Notification[] = [
  // Для диспетчера - новые заявки
  {
    id: '1',
    title: 'Новая заявка',
    message: 'Протечка в ванной комнате - подъезд 1',
    recipient: 'dispatcher',
    sender: 'system',
    type: 'request',
    sentAt: new Date().toISOString(),
    read: false,
    data: { requestId: 'REQ-001' }
  },
  // Для технического директора - заявки на распределение
  {
    id: '2',
    title: 'Заявка ожидает распределения',
    message: 'Заявка REQ-001 готова к назначению исполнителя',
    recipient: 'technical_director', 
    sender: 'dispatcher',
    type: 'request',
    sentAt: new Date().toISOString(),
    read: false,
    data: { requestId: 'REQ-001' }
  },
  // Для жильца - статус заявки
  {
    id: '3',
    title: 'Статус заявки изменен',
    message: 'Ваша заявка REQ-001 принята в работу',
    recipient: 'resident',
    sender: 'system',
    type: 'request',
    sentAt: new Date().toISOString(),
    read: false,
    data: { requestId: 'REQ-001' }
  },
  // Для охраны - системные уведомления
  {
    id: '4', 
    title: 'Система безопасности',
    message: 'Все системы охраны работают в штатном режиме',
    recipient: 'security_guard',
    sender: 'system',
    type: 'system',
    sentAt: new Date().toISOString(),
    read: true,
  },
  // От главного директора - общие сообщения
  {
    id: '5',
    title: 'Важная информация',
    message: 'Завтра плановое отключение воды с 10:00 до 16:00',
    recipient: 'all',
    sender: 'main_director',
    type: 'message', 
    sentAt: new Date().toISOString(),
    read: false,
  }
];

const initialState: NotificationsState = {
  notifications: demoNotifications,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'sentAt' | 'read'>>) => {
      const newNotification: Notification = {
        id: `NOTIF-${Date.now()}`,
        ...action.payload,
        sentAt: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(newNotification);
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    markAllAsRead: (state, action: PayloadAction<string>) => {
      // Пометить все уведомления пользователя как прочитанные
      state.notifications.forEach(notification => {
        if (notification.recipient === action.payload || notification.recipient === 'all') {
          notification.read = true;
        }
      });
    },
    
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    // Специальные actions для разных типов уведомлений согласно ТЗ
    notifyNewRequest: (state, action: PayloadAction<{ requestId: string; theme: string }>) => {
      // Уведомление диспетчеру о новой заявке
      const notification: Notification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Новая заявка',
        message: `Поступила новая заявка: ${action.payload.theme}`,
        recipient: 'dispatcher',
        sender: 'system',
        type: 'request',
        sentAt: new Date().toISOString(),
        read: false,
        data: { requestId: action.payload.requestId }
      };
      state.notifications.unshift(notification);
    },
    
    notifyRequestAssigned: (state, action: PayloadAction<{ requestId: string; residentId: string }>) => {
      // Уведомление жильцу о назначении заявки
      const notification: Notification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Заявка принята в работу',
        message: 'Ваша заявка назначена исполнителю',
        recipient: action.payload.residentId,
        sender: 'system',
        type: 'request',
        sentAt: new Date().toISOString(),
        read: false,
        data: { requestId: action.payload.requestId }
      };
      state.notifications.unshift(notification);
    },
    
    notifyEmergency: (state, action: PayloadAction<{ location: string; message: string }>) => {
      // Экстренное уведомление для охраны и главного директора
      const recipients: UserRole[] = ['security_guard', 'main_director'];
      recipients.forEach(recipient => {
        const notification: Notification = {
          id: `NOTIF-${Date.now()}-${recipient}`,
          title: 'Экстренная ситуация',
          message: `${action.payload.message} в ${action.payload.location}`,
          recipient: recipient,
          sender: 'system',
          type: 'emergency',
          sentAt: new Date().toISOString(),
          read: false,
          data: { location: action.payload.location, emergency: true }
        };
        state.notifications.unshift(notification);
      });
    },
  },
});

export const { 
  addNotification, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  notifyNewRequest,
  notifyRequestAssigned,
  notifyEmergency
} = notificationsSlice.actions;

export default notificationsSlice.reducer;