function fetchAndCache(request) {
    if (request.url.startsWith('chrome-extension://')) {
        return fetch(request);
    }

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
