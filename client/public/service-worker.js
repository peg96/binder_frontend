const CACHE_NAME = 'gestore-binder-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Attivazione del Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Strategia di cache: Network First con fallback su cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clona la risposta per poterla usare e metterla in cache
        const responseToCache = response.clone();
        
        if (event.request.method === 'GET') {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Se la fetch fallisce, prova a recuperare dalla cache
        return caches.match(event.request);
      })
  );
});

// Gestione delle notifiche push
self.addEventListener('push', event => {
  const title = 'GestoreBinder';
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.svg',
    badge: '/badge.svg'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestione del click sulle notifiche
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
