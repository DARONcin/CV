const CACHE_NAME = 'v2_cache_mi_pwa';

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
    console.log('[SW] install event');
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('[SW] caching files');
            return cache.addAll(urlsToCache)
                .then(() => {
                    console.log('[SW] cache complete, skipWaiting');
                    self.skipWaiting();
                });
        })
        .catch(err => console.error('[SW] fallo al abrir cache', err))
    );
});

// Activación del Service Worker
self.addEventListener('activate', e => {
    console.log('[SW] activate event');
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                // Eliminar caches que no estén en la whitelist
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[SW] deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[SW] claim clients');
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', e => {
    // filtrar solo peticiones GET
    if (e.request.method !== 'GET') {
        return;
    }
    e.respondWith(
        caches.match(e.request)
        .then(response => {
            if (response) {
                console.log('[SW] fetch from cache:', e.request.url);
                return response;
            }
            console.log('[SW] fetch from network:', e.request.url);
            return fetch(e.request)
                .catch(err => {
                    // si la red falla, devolver un recurso por defecto si existe
                    console.error('[SW] fetch error, offline?', err);
                    // opcional: return caches.match('/offline.html');
                });
        })
    );
});


