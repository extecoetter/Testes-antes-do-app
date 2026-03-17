const CACHE_NAME = "appclimatizacao-v5";
const APP_BASE = "/APPclimatizacao";

const STATIC_ASSETS = [
  `${APP_BASE}/`,
  `${APP_BASE}/manifest.json`,
  `${APP_BASE}/menu/index-android.html`,
  `${APP_BASE}/menu/index-ios.html`,
  `${APP_BASE}/android/index.html`,
  `${APP_BASE}/ios/index.html`,
  `${APP_BASE}/erros/index.html`,
  `${APP_BASE}/erros/dados-erros-final-split-pisoteto.json`,
  `${APP_BASE}/carga/index.html`,
  `${APP_BASE}/pwa-register.js`,
  `${APP_BASE}/icons/icon-192.png`,
  `${APP_BASE}/icons/icon-512.png`,
  `${APP_BASE}/icons/icon-192-maskable.png`,
  `${APP_BASE}/icons/icon-512-maskable.png`
];

const NETWORK_FIRST = [
  `${APP_BASE}/menu/index-ios.html`,
  `${APP_BASE}/menu/index-android.html`,
  `${APP_BASE}/android/index.html`,
  `${APP_BASE}/ios/index.html`,
  `${APP_BASE}/erros/index.html`,
  `${APP_BASE}/erros/dados-erros-final-split-pisoteto.json`,
  `${APP_BASE}/carga/index.html`
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (!url.pathname.startsWith(APP_BASE)) return;

  const isNetworkFirst = NETWORK_FIRST.some(path => url.pathname === path);

  if (isNetworkFirst) {
    event.respondWith(
      fetch(req)
        .then(networkResp => {
          const copy = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
          return networkResp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(networkResp => {
        const copy = networkResp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
        return networkResp;
      });
    })
  );
});
