// Version change karein taaki browser purana cache delete kare
const CACHE_NAME = 'project-100-v2'; // v1 se v2 kar diya

const ASSETS = [
  './',
  './project100.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Naye service worker ko turant active kare
});

// Activate Event (Purana Cache Delete Karne ke liye)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      // Agar cache mein hai to wahi dikhaye, nahi to network se laye
      return res || fetch(e.request);
    })
  );
});
