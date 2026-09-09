/* Etho-Can Gemstones service worker — offline support + asset caching.
 * Strategy:
 *  - Precache the app shell; navigation requests fall back to cached shell
 *    when offline (the SPA router handles the rest).
 *  - Cache-first for images/fonts/static assets.
 *  - Network-first for everything else, falling back to cache.
 */
const VERSION = 'v1';
const SHELL_CACHE = `ecg-shell-${VERSION}`;
const ASSET_CACHE = `ecg-assets-${VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-64.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/logo-white.png',
  '/images/logo-black.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // App navigations: network first, fall back to the cached shell when offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets: cache-first
  if (/\.(png|jpg|jpeg|webp|svg|ico|woff2?|css|js|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
      )
    );
  }
});
