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
