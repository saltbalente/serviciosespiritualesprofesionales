// Service Worker para Servicios Espirituales Profesionales
// Versión 1.0 - Optimización de rendimiento y funcionalidad offline

const CACHE_NAME = 'servicios-espirituales-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Archivos estáticos para cachear
const STATIC_FILES = [
  '/',
  '/index.html',
  '/servicios.html',
  '/sobre-nosotros.html',
  '/testimonios.html',
  '/blog.html',
  '/contacto.html',
  '/css/main.css',
  '/js/main.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap'
];

// Archivos dinámicos que se cachean bajo demanda
const DYNAMIC_FILES = [
  'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image',
  'https://fonts.gstatic.com'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Cacheando archivos estáticos');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Archivos estáticos cacheados exitosamente');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Error al cachear archivos estáticos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Eliminando cache obsoleto:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activado');
        return self.clients.claim();
      })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar peticiones HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Estrategia Cache First para archivos estáticos
  if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Estrategia Network First para páginas HTML
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Estrategia Stale While Revalidate para imágenes y fuentes
  if (isImageOrFont(request.url)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Estrategia Network First para todo lo demás
  event.respondWith(networkFirst(request));
});

// Estrategia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Error en Cache First:', error);
    return new Response('Contenido no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estrategia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Red no disponible, buscando en cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline personalizada para HTML
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/index.html');
    }
    
    return new Response('Contenido no disponible offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estrategia Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Verificar si es un archivo estático
function isStaticAsset(url) {
  return url.includes('.css') || 
         url.includes('.js') || 
         url.includes('fonts.googleapis.com') ||
         STATIC_FILES.some(file => url.includes(file));
}

// Verificar si es imagen o fuente
function isImageOrFont(url) {
  return url.includes('.jpg') ||
         url.includes('.jpeg') ||
         url.includes('.png') ||
         url.includes('.gif') ||
         url.includes('.webp') ||
         url.includes('.svg') ||
         url.includes('.woff') ||
         url.includes('.woff2') ||
         url.includes('.ttf') ||
         url.includes('.otf') ||
         url.includes('fonts.gstatic.com') ||
         url.includes('trae-api-us.mchost.guru');
}

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Manejar notificaciones push (para futuras implementaciones)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nueva consulta espiritual disponible',
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/contacto'
      },
      actions: [
        {
          action: 'open',
          title: 'Ver consulta',
          icon: '/assets/icons/icon-72x72.png'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Servicios Espirituales',
        options
      )
    );
  }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    const url = event.notification.data.url || '/contacto';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Función para sincronizar formularios de contacto offline
async function syncContactForm() {
  try {
    // Aquí se implementaría la lógica para enviar formularios guardados offline
    console.log('[SW] Sincronizando formularios de contacto...');
    // Esta funcionalidad se puede expandir según las necesidades
  } catch (error) {
    console.error('[SW] Error al sincronizar formularios:', error);
  }
}

console.log('[SW] Service Worker cargado exitosamente');