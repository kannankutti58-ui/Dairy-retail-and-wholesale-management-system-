/**
 * Aavin Milk Agency - Web Push Notification Service Worker
 * Handles cold storage temperature breach alerts and delivery dispatch notifications
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {
    title: "🥛 Kuttiammal's Dairy Hub Alert",
    body: 'Cold storage status update from Aavin Milk Agency.',
    icon: '/kuttiammal_dairy_logo_1791197744218.jpg',
    badge: '/kuttiammal_dairy_logo_1791197744218.jpg',
    tag: 'aavin-alert',
    data: { url: '/#freezer-monitor' }
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/kuttiammal_dairy_logo_1791197744218.jpg',
    badge: data.badge || '/kuttiammal_dairy_logo_1791197744218.jpg',
    tag: data.tag || 'aavin-freezer-alert',
    vibrate: [300, 100, 300, 100, 400],
    data: data.data || { url: '/#freezer-monitor' },
    requireInteraction: true,
    actions: data.actions || [
      { action: 'open', title: '❄️ Open Cold Storage' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/#freezer-monitor';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
