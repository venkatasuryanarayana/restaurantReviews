let firstCache='restaurant-v1';

// Installing service Worker using install event
self.addEventListener('install', function (event) {
 console.log('serviceWorker Installed');
 event.waitUntil(
   caches.open(firstCache)
     .then(function (cache) {

       cache.addAll([

       ]);
     })
 );
});

// Activating serviceWorker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
    .then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
               cacheName != firstCache;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
})

// Fetching Data using fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(firstCache).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
