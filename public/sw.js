self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open('perspace-shell-v1').then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        if (event.request.url.includes('/_next/static/')) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return cached || new Response('Offline', { status: 503 });
      }
    })
  );
});
