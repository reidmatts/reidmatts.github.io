const CODE_CACHE_NAME = 'reid-code-v4';
const MEDIA_CACHE_NAME = 'reid-media-v1';

const CORE_ASSETS = [
    './',
    './index.html',
    './logo.png',
    './css/base-theme.css?v=4',
    './css/navigation.css?v=4',
    './css/gallery-masonry.css?v=4',
    './css/about-editorial.css?v=4',
    './css/liquid-glass-ui.css?v=4',
    './js/preferences-engine.js?v=4',
    './js/masonry-flip.js?v=4',
    './js/navigation-router.js?v=4',
    './js/ambilight-modal.js?v=4',
    './js/badges-observer.js?v=4',
    './js/cinematic-intro.js?v=4',
    './js/media-utils.js?v=4'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CODE_CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
    );
});

self.addEventListener('activate', (e) => {
    const validCaches = [CODE_CACHE_NAME, MEDIA_CACHE_NAME];
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (!validCaches.includes(key)) return caches.delete(key);
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
        // Instant 0ms return from cache, while silently checking in the background if the file was replaced on GitHub
        e.respondWith(
            caches.open(MEDIA_CACHE_NAME).then((cache) =>
                cache.match(e.request).then((cached) => {
                    const networkUpdate = fetch(e.request).then((response) => {
                        if (response && response.status === 200) {
                            cache.put(e.request, response.clone());
                        }
                        return response;
                    }).catch(() => cached);

                    return cached || networkUpdate;
                })
            )
        );
    } else {
        const isNavigation = e.request.mode === 'navigate';
        // Network-first with cache: 'no-cache' for HTML, CSS, JS so browser HTTP disk cache never serves stale scripts
        e.respondWith(
            fetch(e.request, { cache: 'no-cache' }).then((response) => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CODE_CACHE_NAME).then((cache) => cache.put(e.request, clone));
                }
                return response;
            }).catch(() =>
                caches.match(e.request).then((cached) => cached || (isNavigation ? caches.match('./index.html') : undefined))
            )
        );
    }
});

