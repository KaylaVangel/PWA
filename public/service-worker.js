const cacheName = 'v4';
///////////to add all files manually///////////////////
// const cacheAssets = [
//     './index.html',
//     './style.css'

// ]


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




/////////////cache entire response/////////////////

//activate//
self.addEventListener('activate', e => {
    console.log('service worker activated');
    //remove old caches//
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all (
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('service worker:clearing cache');
                        return cacheAssets.delete(cache);
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
    }). catch(err => caches.match(e.request).then(res => res))
    );
});