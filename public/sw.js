const staticCacheName = 'site-static-v7';
const dynamicCacheName = 'site-dynamic-v7';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/db.js',
  '/css/master.css',
  '/images/assortiment-01.png',
  '/images/assortiment-02.png',
  '/images/assortiment-03.png',
  '/images/assortiment-04.png',
  '/images/assortiment-05.png',
  '/images/header.png',
  '/images/insta-01.png',
  '/images/insta-02.png',
  '/images/insta-03.png',
  '/images/insta-04.png',
  '/images/insta-05.png',
  '/images/logo.png',
  '/images/punten.png',
  '/images/sfeerfoto-01.png',
  '/images/usp-icon.png',
  '/images/menu-icon.png',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if (!(evt.request.url.indexOf('http') === 0)) return;
  
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        })
      });
    }).catch(() => {
      if(evt.request.url.indexOf('.html') > -1){
        return caches.match('/pages/fallback.html');
      } 
    })
  );
});