


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

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'LinarApp';
  const options = {
    body: payload.notification?.body || 'Новое сообщение',
    icon: '/logo192.png',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200]
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});