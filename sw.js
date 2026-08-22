// Real bug, hit live 2026-08-22: cache-first meant every fresh deploy was invisible until a
// second reload happened to land after the background refresh finished -- in practice, often
// invisible indefinitely. The old ponytail note flagged this exact staleness risk as a future
// problem; it became a real one. Network-first now: always try the live network first (so a
// fresh deploy shows up on the very next load), only falling back to the cache when the network
// genuinely fails -- that's the actual offline-at-practice case this file exists for.
const CACHE = "playbook-trainer-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
        return response;
      })
      .catch(() => caches.open(CACHE).then((cache) => cache.match(request))),
  );
});
