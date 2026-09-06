const CACHE_NAME = 'tripgenius-offline-v1';

// Install event - take over immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Handle offline caching
self.addEventListener('fetch', (event) => {
  // We only cache GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Exclude auth endpoints, clerk, chrome extensions, etc.
  if (
    url.pathname.startsWith('/api/auth') || 
    url.hostname.includes('clerk') ||
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  // Strategy for Images (Unsplash Proxy): Cache First, fallback to Network
  if (url.pathname.startsWith('/api/image') || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return networkResponse;
        }).catch(() => {
          // If offline and no image, return nothing (or a placeholder)
          return new Response('', { status: 404, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // Strategy for Everything Else (Pages, RSC payloads, JS, CSS): Network First, fallback to Cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // If network fails (user is offline), try to return the cached page/asset!
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If we don't have it cached, throw error
        throw new Error('Offline and not in cache');
      })
  );
});
