// src/notifications.ts
import { PushNotifications } from '@capacitor/push-notifications';

export const initNotifications = async () => {
  try {
    // Запрос разрешения на уведомления
    const permStatus = await PushNotifications.requestPermissions();
    
    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
      
      // Слушаем уведомления
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received', notification);
      });
      
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification);
      });
    }
  } catch (error) {
    console.error('Error initializing notifications', error);
  }
};

export const sendLocalNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
};