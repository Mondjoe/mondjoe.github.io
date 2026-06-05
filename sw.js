self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("charm-cache").then((cache) => {
      return cache.addAll(["/offline.html"]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      return self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "NEW_VERSION" });
        });
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match("/offline.html"))
  );
});
