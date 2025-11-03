import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export class NotificationService {
  static async requestPermissions() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleNotification(title: string, body: string, data: any = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // Мгновенное уведомление
    });
  }

  static async sendRequestNotification(requestId: string, theme: string) {
    await this.scheduleNotification(
      'Новая заявка',
      `Поступила новая заявка: ${theme}`,
      { requestId, type: 'new_request' }
    );
  }

  static async sendEmergencyNotification(location: string) {
    await this.scheduleNotification(
      'Экстренная ситуация',
      `Обнаружена проблема в ${location}`,
      { type: 'emergency' }
    );
  }
}