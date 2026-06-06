self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("charm-cache").then((cache) => {
      return cache.addAll([
        "/offline.html",
        "/index.html",
        "/dashboard.html",
        "/about.html",
        "/settings.html"
      ]);
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
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match("/offline.html");
      }
      return caches.match(event.request);
    })
  );
});
