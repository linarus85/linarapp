
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Ваша конфигурация Firebase (скопируйте из firebase.ts)
const firebaseConfig = {
    apiKey: "AIzaSyBuGZ-xJEz1npWm6ei9PGwCdZ4-56w2htM",
    authDomain: "linarapp-86ac5.firebaseapp.com",
    databaseURL: "https://linarapp-86ac5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "linarapp-86ac5",
    storageBucket: "linarapp-86ac5.firebasestorage.app",
    messagingSenderId: "110619959074",
    appId: "1:110619959074:web:2f98f08f4fcf0dd02d4f7b"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'LinarApp';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Новое сообщение',
    icon: '/linarapp/logo192.png',
    badge: '/linarapp/logo192.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Открыть'
      }
    ]
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if ('focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/linarapp/');
          }
        })
    );
  }
});

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});