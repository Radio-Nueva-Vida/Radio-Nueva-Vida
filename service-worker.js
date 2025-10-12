
// service-worker.js

const CACHE_NAME = 'radio-nv-cache-v1';

const urlsToCache = [
  './',
  './index.html',
  './estilos.css',
  './estilos-responsive.css',
  './manifest.json',
  './icono-192.png',
  './icono-512.png',
  './logo-nueva-vida.png',
  './ondas-animadas.svg',
  './favicono.png',
  './placeholder.png'
];

// 1. Instalación: carga inicial de caché
self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('❌ Error precacheando:', error))
  );
  self.skipWaiting();
});

// 2. Activación: limpia cachés viejos
self.addEventListener('activate', (event) => {
  console.log('⚙️ Activando Service Worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('🗑️ Eliminando caché vieja:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// 3. Fetch: responde desde caché o red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

