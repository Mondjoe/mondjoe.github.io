// -------------------------------
// Charm Capsule — Multi‑Page PWA
// -------------------------------

// Install: cache all core pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("charm-cache").then((cache) => {
      return cache.addAll([
        "/offline.html",
        "/index.html",
        "/dashboard.html",
        "/about.html",
        "/settings.html",
        "/Assets/og-image.png",
        "/favicon.ico"
      ]);
    })
  );
  self.skipWaiting();
});

// Activate: claim clients + notify about new version
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

// Fetch: network first, fallback to offline.html for navigation
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If user is navigating between pages
      if (event.request.mode === "navigate") {
        return caches.match("/offline.html");
      }

      // Otherwise return cached asset
      return caches.match(event.request);
    })
  );
});
