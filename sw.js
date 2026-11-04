const CACHE_NAME = 'toxic-horizon-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './js/animations.js',
  './manifest.json',
  './img/LOGO.jpeg',
  './img/wallpaper1.jpeg',
  './img/icon-192.png',
  './img/icon-512.png'
];

// 1. INSTALACIÓN
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaché de recursos iniciado');
      // Usamos map/catch para evitar que un recurso faltante rompa toda la instalación
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => cache.add(url))
      );
    })
  );
});

// 2. ACTIVACIÓN INMEDIATA
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// 3. ESTRATEGIA DE RED / CACHÉ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// 4. RECEPCIÓN DE NOTIFICACIÓN PUSH
self.addEventListener('push', (event) => {
  let data = {
    title: 'Toxic Horizon',
    body: '¡Actividad detectada en el sector radiactivo!',
    url: './'
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
    icon: './img/icon-192.png',
    badge: './img/icon-192.png',
    vibrate: [150, 50, 150],
    data: {
      url: data.url || './'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 5. CLIC EN LA NOTIFICACIÓN
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});