import { convertEndpoint } from '../config.js';
const converter = 'converterCache-v1.0.9';
self.addEventListener('fetch', e => {
    // console.log(e.request);
    e.respondWith(
        caches.match(e.request)
        .then( response => {
            return response || fetch(e.request);
        }).catch(error => {
            return caches.match('/offline.html');
        })
    );
});

addEventListener('install', function(e){
    // skipWaiting();
    e.waitUntil(
        caches.open(converter)
        .then( cache => {
            const query = `${this.from}_${this.to}`;
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/css/style.css',
                'img/arrows.svg',
                '/js/bundle.js',
                `https://free.currencyconverterapi.com/${convertEndpoint}q=${query}`
            ]);
        }).catch(error => {
            console.log(error);
        })
    );
    // console.log('The service worker is listening');
});


self.addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys()
        .then(appcaches => {
            return Promise.all(
                appcaches.map(appcache => {
                    if (appcache != converter) {
                        return caches.delete(appcache);
                    }
                    console.log('Deleted old caches');
                })
            );
        }).then( () => {
            return clients.claim();
        } )
    );
    // console.log('service worker activated');
});