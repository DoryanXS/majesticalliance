const CACHE_NAME = 'Majestic Alliance';
const urlsToCache = [
    '/',
    '/majesticalliance.github.io/index.html',
    '/majesticalliance.github.io/styles/main.css',
    '/majesticalliance.github.io/scripts/main.js',
    '/majesticalliance.github.io/images/icon-144.png',
    '/majesticalliance.github.io/images/icon-192.png',
    '/majesticalliance.github.io/images/icon-196.png',
    '/majesticalliance.github.io/images/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => console.log('Cache installation successful'))
            .catch(error => console.error('Cache installation failed:', error))
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
