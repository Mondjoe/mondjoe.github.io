/* -----------------------------------------------------------
   Charm Capsule — Service Worker (Final Version)
   File: sw.js
   Purpose: Offline caching for shell + core assets
----------------------------------------------------------- */

const CACHE_NAME = 'charm-capsule-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',

  // Styles
  '/snapshot.css',
  '/dashboard.css',

  // Scripts
  '/router.js',
  '/governance.js',
  '/snapshot-viewer.js',
  '/snapshot-list.js',
  '/capsule-info.js',

  // Icons (adjust paths if needed)
  '/favicon.ico',
  '/Assets/favicon-32.png',
  '/Assets/favicon-192.png',
  '/Assets/splash-1024.png',
  '/Assets/splash-2048.png'
];

// Install: pre-cache core shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for shell, network-first for metadata
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  const isMetadata =
    url.pathname.startsWith('/metadata/') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.html');

  if (isMetadata) {
    // Network-first for metadata
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for shell/assets
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        });
      })
    );
  }
});
