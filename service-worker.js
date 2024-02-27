const CACHE_NAME = 'Majestic Alliance';
const urlsToCache = [
    '/doryanxs.github.io/',
    '/doryanxs.github.io/index.html',
    '/doryanxs.github.io/styles/main.css',
    '/doryanxs.github.io/scripts/main.js',
    '/doryanxs.github.io/images/icon.png',
    '/doryanxs.github.io/images/icon-256.png',
    '/doryanxs.github.io/images/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
    caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
    caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
    caches.keys()
        .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
            }
        })
        ))
    );
});

