// Basic service worker: caches core files so the app can install
// and reopen even with a weak/no connection. Expand the cache list
// as you add more files (e.g., module PDFs you want available offline).

const CACHE_NAME = "hub-cache-v2";
const CORE_ASSETS = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "modules/Nature-of-Inquiry-and-Research.pdf",
  "modules/Identifying-the-Inquiry-and-Stating-the-Problem.pdf",
  "modules/Conceptual-Framework-and-Review-of-Related-Literature.pdf",
  "modules/Understanding-Data-and-Ways-to-Collect-Them.pdf",
  "modules/Data-Collection-Presentation-and-Analysis.pdf",
  "modules/Research-Conclusions-and-Recommendations.pdf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
