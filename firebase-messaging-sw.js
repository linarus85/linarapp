// public/firebase-messaging-sw.js
// Простой сервис-воркер для уведомлений
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push received:', event);
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Новое сообщение',
    icon: '/linarapp/logo192.png',
    badge: '/linarapp/logo192.png',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'LinarApp', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/linarapp/')
  );
});



