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
            .then(() => console.log('Cache installation successful'))
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

            return caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseToCache))
                .then(() => {
                    console.log('Cached:', request.url);
                    return response;
                })
                .catch(error => {
                    console.error('Caching failed:', request.url, error);
                    return response;
                });
        })
        .catch(error => {
            console.error('Fetch failed:', request.url, error);
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
            .then(() => console.log('Cache cleanup successful'))
            .catch(error => console.error('Cache cleanup failed:', error))
    );
});
