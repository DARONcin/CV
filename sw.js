const CACHE_NAME = 'v1_cache_mi_pwa';

const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './img/dtg_16x16.png',
    './img/dtg_32x32.png',
    './img/dtg_64x64.png',
    './img/dtg_96x96.png',
    './img/dtg_124x124.png',
    './img/dtg_128x128.png',
    './img/dtg_144x144.png',
    './img/dtg_192x192.png',
    './img/dtg_256x256.png',
    './img/dtg_384x384.png',
    './img/dtg_512x512.png',
    './img/dtg_1024x1024.png',
    './main.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
                .then(() => {
                    self.skipWaiting();
                });
        })
        .catch(err => console.log('No se ha registrado el cache', err))
    );
});

// Activación del Service Worker
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                // Eliminar caches que no estén en la whitelist
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim()
        )
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
        .then(response => {
            if (response) {
                // Devuelve el recurso desde el cache
                return response;
            }
            // Si no está en el cache, realiza la petición a la red
            return fetch(e.request);
        })
    );
});


