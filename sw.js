// add an install event listener to the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v2').then(cache => cache.addAll([
            '/poetry/',
            '/poetry/index.html',
            '/poetry/404.html',
            '/poetry/css/main.css',
            '/poetry/css/bootstrap.min.css',
            '/poetry/css/normalize.css',
            '/poetry/css/paper-kit.css',
            'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css',
            '/poetry/css/paper-kit.css',
            '/poetry/js/vendor/modernizr-3.6.0.min.js',
            '/poetry/js/vendor/jquery-3.3.1.min.js',
            '/poetry/js/jquery-ui-1.12.1.custom.min.js',
            '/poetry/js/popper.js',
            '/poetry/js/plugins.js',
            '/poetry/js/main.js',
            '/poetry/js/bootstrap.min.js',
            '/poetry/js/bootstrap-switch.min.js',
            '/poetry/js/paper-kit.js',
            'https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js'
        ]))
    );
});

// attach a fetch event listener to the service worker,
// then call the respondWith() method on the event to hijack HTTP responses
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(response => {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
                let responseClone = response.clone();

                caches.open('v2').then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(() => // return Response;
                new Response('Something went wrong :('));
        }
    }));
});

// activate
self.addEventListener('activate', event => {
    const cacheWhitelist = ['v2'];

    event.waitUntil(
        caches.keys().then(keyList => Promise.all(keyList.map(key => {
            if (!cacheWhitelist.includes(key)) {
                return caches.delete(key);
            }
        })))
    );
});