const CACHE_NAME = 'stitch-rpg-v1';

// Nur die essentiellen Dateien cachen (keine großen Audio/Video-Dateien)
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './items.js',
  './quests_data.js',
  './manifest.json',
  './tailwind.min.js',
  './material-symbols.css',
  './material-symbols.ttf',
  './icon.png',
  './google-fonts.css',
];

// Diese Dateitypen nicht cachen (zu groß)
const NO_CACHE_EXTENSIONS = ['.mp3', '.mp4'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching core assets...');
      return cache.addAll(CORE_ASSETS);
    }).catch(err => {
      console.warn('[SW] Cache install failed:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const ext = url.pathname.substring(url.pathname.lastIndexOf('.'));

  // Große Mediendateien immer vom Netzwerk laden
  if (NO_CACHE_EXTENSIONS.includes(ext)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Für alle anderen: Cache-first, Netzwerk als Fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => {
      // Offline-Fallback auf index.html
      return caches.match('./index.html');
    })
  );
});
