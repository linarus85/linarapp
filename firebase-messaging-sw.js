// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Конфигурация Firebase (скопируйте из вашего проекта)
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

// Обработка уведомлений в фоне
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'LinarApp';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Новое сообщение',
    icon: '/logo192.png',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        if (windowClients.length > 0) {
          windowClients[0].focus();
        } else {
          clients.openWindow('/');
        }
      })
  );
});
