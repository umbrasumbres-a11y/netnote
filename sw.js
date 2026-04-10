const CACHE_NAME = 'netnote-v3'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest', // PASTIKAN INI ADA
  './icon-192.png',        // PASTIKAN INI ADA
  './icon-512.png',        // PASTIKAN INI
  // CSS & Fonts
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  // Gambar QRIS
  'https://z-cdn-media.chatglm.cn/files/258f98b6-4146-4c1d-b6cc-7be09d423b3a.png?auth_key=1875795308-f74145f8ba7f486faac40f34872ba664-0-7865734052d32e2a21fa35050fd455c0'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Membuka Cache V3');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
