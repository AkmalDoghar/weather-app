const CACHE_NAME = 'skypulse-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/app-icon.png',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  // Do NOT skip waiting here — we want to notify first so user can choose to update
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
  }
});

// Listen for "SKIP_WAITING" message from the UI → activate new SW immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
