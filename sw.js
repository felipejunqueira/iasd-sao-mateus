/**
 * Service Worker da IASD São Mateus (Filosofia Unix)
 * Cache First para assets estáticos e Network First para dados (< 90 linhas)
 */
const CACHE_NAME = 'iasd-sm-v1';
const PRECACHE = [
  './', 'index.html', 'manifest.webmanifest',
  'css/main.css', 'css/core/variables.css', 'css/core/reset.css',
  'css/core/layout.css', 'css/core/accessibility.css',
  'css/core/contrast-theme.css', 'css/components/pwa.css',
  'js/main.js', 'js/modules/components.js', 'js/modules/menu.js',
  'js/modules/tab-router.js', 'js/modules/tab-a11y.js',
  'js/modules/services.js', 'js/modules/series.js', 'js/modules/series-modal.js',
  'js/modules/pix.js', 'js/modules/gallery.js', 'js/modules/lightbox.js',
  'js/modules/forms.js', 'js/modules/a11y-theme.js', 'js/modules/vlibras.js',
  'js/modules/i18n.js', 'js/modules/utils.js', 'js/modules/pwa.js',
  'js/locales/pt.js', 'js/locales/en.js', 'js/locales/index.js',
  'data/series.json', 'data/feed.json',
  'assets/images/logo_oficial.png', 'assets/images/icon-192.png',
  'assets/images/icon-512.png', 'assets/images/icon-maskable-512.png',
  'assets/images/real_worship.jpg',
  'partials/02-a11y-bar.html', 'partials/03-header.html',
  'partials/04-tabs-nav.html', 'partials/06-hero.html',
  'partials/07-quick-links.html', 'partials/08-cultos.html',
  'partials/09-pastor.html', 'partials/10-series.html',
  'partials/11-location.html', 'partials/14-dizimos.html',
  'partials/15-gallery.html', 'partials/16-forms.html',
  'partials/19-timeline.html', 'partials/20-remedies.html',
  'partials/21-ministries.html', 'partials/22-marcos.html',
  'partials/24-modals.html', 'partials/25-footer.html',
  'partials/26-footer-bottom.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

const clean = (url) => url.split('?')[0];

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  const isData = url.pathname.includes('/data/') || url.pathname.endsWith('.json');

  if (isData) {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(clean(e.request.url), clone));
        }
        return res;
      }).catch(() => caches.match(clean(e.request.url), { ignoreSearch: true }))
    );
    return;
  }

  e.respondWith(
    caches.match(clean(e.request.url), { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(clean(e.request.url), clone));
        }
        return res;
      }).catch(() => {
        if (e.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('index.html');
        }
      });
    })
  );
});
