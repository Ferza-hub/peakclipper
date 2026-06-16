const CACHE = "peakclipper-v1";
const PRECACHE = ["/", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Network-first for API routes; cache-first for static assets
  if (e.request.url.includes("/api/")) {
    e.respondWith(fetch(e.request).catch(() => new Response("offline", { status: 503 })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached ?? fetch(e.request))
  );
});
