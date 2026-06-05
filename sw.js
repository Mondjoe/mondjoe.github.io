self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("charm-cache").then((cache) => {
      return cache.addAll(["/offline.html"]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match("/offline.html"))
  );
});
