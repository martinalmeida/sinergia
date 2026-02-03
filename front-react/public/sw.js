const CACHE_NAME = "Sinergia-v2";
const STATIC_CACHE = "Sinergia-static-v2";

// URLs para cache inicial - MÍNIMAS ESENCIALES
const urlsToCache = [
  "/",
  "/manifest.json",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Cacheando recursos esenciales");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("[SW] Instalación completada - skipWaiting");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Error en instalación:", error);
      })
  );
});

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activando...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
              console.log("[SW] Eliminando cache antigua:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[SW] Activación completada - claiming clients");
        return self.clients.claim();
      })
  );
});

// Estrategia de caché MEJORADA
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Saltar para requests de API
  if (url.pathname.startsWith("/api-lh/") || url.pathname.startsWith("/api/")) {
    return;
  }

  // Saltar para requests no GET
  if (event.request.method !== "GET") {
    return;
  }

  // Estrategia: Cache First para estáticos, Network First para HTML
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Para recursos estáticos (CSS, JS, imágenes, fuentes)
      if (
        event.request.destination === "style" ||
        event.request.destination === "script" ||
        event.request.destination === "image" ||
        event.request.destination === "font"
      ) {
        // Cache First para estáticos
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no está en cache, ir a red y guardar
        return fetch(event.request)
          .then((response) => {
            // Solo cachear responses válidas
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches
                .open(STATIC_CACHE)
                .then((cache) => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Fallback genérico para estáticos
            return new Response("Offline", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            });
          });
      }

      // Para documentos (HTML) - Network First
      return fetch(event.request)
        .then((response) => {
          // Solo cachear HTML responses exitosas
          if (response.status === 200 && response.type === "basic") {
            const responseToCache = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          // Fallback a cache para HTML
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si no hay cache, mostrar offline page
          return caches.match("/").then((offlineResponse) => {
            return (
              offlineResponse ||
              new Response("Página no disponible offline", {
                status: 503,
                headers: { "Content-Type": "text/plain" },
              })
            );
          });
        });
    })
  );
});

// Manejo de mensajes (opcional)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});