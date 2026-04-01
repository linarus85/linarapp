// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBuGZ-xJEz1npWm6ei9PGwCdZ4-56w2htM",
    authDomain: "linarapp-86ac5.firebaseapp.com",
    databaseURL: "https://linarapp-86ac5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "linarapp-86ac5",
    storageBucket: "linarapp-86ac5.firebasestorage.app",
    messagingSenderId: "110619959074",
    appId: "1:110619959074:web:2f98f08f4fcf0dd02d4f7b"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Обработка фоновых сообщений
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'LinarApp';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Новое сообщение',
    icon: '/linarapp/logo192.png',
    badge: '/linarapp/favicon.ico',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Проверяем, есть ли уже открытое окно
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if ('focus' in client) {
            return client.focus();
          }
        }
        // Если нет, открываем новое
        if (clients.openWindow) {
          return clients.openWindow('/linarapp/');
        }
      })
  );
});

// Сообщаем, что сервис-воркер активирован
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  event.waitUntil(self.skipWaiting());
});