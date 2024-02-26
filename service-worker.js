const CACHE_NAME = 'Majestic-Alliance';
const urlsToCache = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/main.js',
    './images/icon-144.png',
    './images/icon-192.png',
    './images/icon-196.png',
    './images/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .catch(error => console.error('Cache installation failed:', error))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetchAndCache(event.request))
    );
});

function fetchAndCache(request) {
    return fetch(request)
        .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseToCache));

            return response;
        });
}

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
