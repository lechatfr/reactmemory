// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var cacheName = 'pwapp-reactmemory-v0.1.25';
var filesToCache = [
  '/',
  '/#',
  '/index.html',
  '/index.html#',
  '/scripts/app.js',
  '/scripts/react.js',
  '/scripts/react-dom.js',
  '/scripts/browser.js',
  '/scripts/jquery.min.js',
  '/scripts/marked.min.js',
  '/styles/inline.css',
  '/images/espaceur.gif',
  '/images/ic_refresh_white_24px.svg',
  '/images/img01.jpg',
  '/images/img02.jpg',
  '/images/img03.jpg',
  '/images/img04.jpg',
  '/images/img05.jpg',
  '/images/img06.jpg',
  '/images/img07.jpg',
  '/images/img08.jpg',
  '/images/img09.jpg',
  '/images/img10.jpg',
  '/images/img11.jpg',
  '/images/img12.jpg',
  '/images/img13.jpg',
  '/images/img14.jpg',
  '/images/img15.jpg',
  '/images/img16.jpg',
  '/images/img17.jpg',
  '/images/img18.jpg',
  '/images/img19.jpg',
  '/images/img20.jpg',
  '/images/img21.jpg',
  '/images/img22.jpg',
  '/images/img23.jpg'
];

// Install event - cache files (...or not)
// Be sure to call skipWaiting()!
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            // Important to `return` the promise here to have `skipWaiting()`
            // fire after the cache has been updated.
            return cache.addAll(filesToCache);
        }).then(function () {
            // `skipWaiting()` forces the waiting ServiceWorker to become the
            // active ServiceWorker, triggering the `onactivate` event.
            // Together with `Clients.claim()` this allows a worker to take effect
            // immediately in the client(s).
            return self.skipWaiting();
        })
    );
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // `claim()` sets this worker as the active worker for all clients that
    // match the workers scope and triggers an `oncontrollerchange` event for
    // the clients.
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
