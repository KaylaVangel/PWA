const cacheName = 'v4';
/////////to add all files manually///////////////////
const cacheAssets = [
    "/",
  "./index.html",
  "./css/styles.css",
  "./js/idb.js",
  "./js/index.js",
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png"
];

//install//
// self.addEventListener('install', e => {
//     console.log('service worker installed');
//     e.waitUntil(
//         caches
//         .open(cacheName)
//         .then(cache => {
//             console.log('service worker:caching files');
//             cache.addAll(cacheAssets);
//         })
//         .then(() => self.skipWaiting())
//     );
// });
console.log("here")

self.addEventListener('install', e => {
    console.log("This")
    e.waitUntil(caches.open(cacheName).then(cache => { //added with Daniel//
        console.log("these are the files in our cache");
        console.log(cache);
        return (cache.addAll(cacheAssets))
    }))
    self.skipWaiting() // always activate updated SW immediately
})


/////////////cache entire response/////////////////

//activate//
self.addEventListener('activate', e => {
    console.log('service worker activated');
    //remove old caches//
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    console.log('cache');
                    if (cache !== cacheName) {
                        console.log('service worker:clearing cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});


//fetch event//
self.addEventListener('fetch', e => {
    console.log('service worker: fetching');
    // e.respondWith(fetch(e.request).catch(() => caches.match(e.request))
    e.respondWith(fetch(e.request)
        .then(res => {
            //make clone of response//
            const clone = res.clone();
            //open cache
            caches.open(cacheName)
                .then(cache => {
                    //add response to cache
                    cache.put(e.request, clone);
                });
            return res;
        }).catch(err => caches.match(e.request).then(res => res))
    );
});