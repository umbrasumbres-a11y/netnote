const CACHE_NAME = 'netnote-v4'; // UBAH KE v4 AGAR CACHE BERSIH
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest', // Manifest WAJIB dicache
  '/icon-192.png',        // Icon 192 WAJIB dicache
  '/icon-512.png',        // Icon 512 WAJIB dicache
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://z-cdn-media.chatglm.cn/files/258f98b6-4146-4c1d-b6cc-7be09d423b3a.png?auth_key=1875795308-f74145f8ba7f486faac40f34872ba664-0-7865734052d32e2a21fa35050fd455c0'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache V4 dibuka');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Fetch Event (Offline First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, tampilkan. Jika tidak, fetch dari internet.
      return response || fetch(event.request).then(fetchResponse => {
        // Simpan resource baru ke cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      // Fallback jika offline
      if (event.request.destination === 'document') {
        return caches.match('/index.html');
      }
    })
  );
});

// Activate Event (Hapus Cache Lama)
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