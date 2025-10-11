// service-worker.js

// Usa un nombre de caché más específico, incluyendo la versión
const CACHE_NAME = 'radio-nv-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/styles-responsive.css',
  '/manifest.json',
  // Asegúrate de que los nombres de los iconos coincidan con tu repo.
  // Tu repo tiene: 'icono-192.png', 'icono-512.png'
  // Tu SW tenía: '/icon-192.png', '/icon-512.png'
  '/icono-192.png', // ¡Corregido el nombre!
  '/icono-512.png'  // ¡Corregido el nombre!
];

// 1. EVENTO DE INSTALACIÓN: Cargar archivos en el caché
self.addEventListener('install', (event) => {
  console.log("Service Worker instalado");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Fallo al precachear los assets:", error);
      })
  );
});

// 2. EVENTO DE ACTIVACIÓN: Limpiar cachés viejos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Elimina cualquier caché que no esté en la lista blanca (whitelist)
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. EVENTO FETCH: Interceptar peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Sirve desde caché si se encuentra
        if (response) {
          return response;
        }

        // Si no está en caché, continúa con la petición de red
        return fetch(event.request);
      })
  );
});
