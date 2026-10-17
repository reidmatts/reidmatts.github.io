const CACHE_NAME = 'reid-portfolio-v3';
const CORE_ASSETS = [
    './',
    './index.html',
    './logo.png',
    './css/base-theme.css',
    './css/navigation.css',
    './css/gallery-masonry.css',
    './css/about-editorial.css',
    './css/liquid-glass-ui.css',
    './js/preferences-engine.js',
    './js/masonry-flip.js',
    './js/navigation-router.js',
    './js/ambilight-modal.js',
    './js/badges-observer.js',
    './js/cinematic-intro.js',
    './js/media-utils.js'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);
    if (url.origin !== self.location.origin) return;

    // Skip range requests (video/audio streaming)
    if (e.request.headers.has('range')) return;

    const isImageOrFont = /\.(avif|png|jpg|jpeg|webp|woff2?|ttf|otf)$/i.test(url.pathname);

    if (isImageOrFont) {
        // Cache-first for heavy immutable images/fonts, revalidate in background
        e.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(e.request).then((cached) => {
                    const networkFetch = fetch(e.request).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(e.request, response.clone());
                        }
                        return response;
                    }).catch(() => cached);
                    return cached || networkFetch;
                })
            )
        );
    } else {
        // Network-first / Stale-While-Revalidate for HTML, CSS, JS so GitHub pushes show up immediately
        e.respondWith(
            fetch(e.request).then((response) => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                }
                return response;
            }).catch(() => caches.match(e.request))
        );
    }
});