let CACHE_NAME = 'PWA_design-onchange';
let urlsToCache = [
    '/PWA_design-onchange/index.html',
    '/PWA_design-onchange/style.css',
    '/PWA_design-onchange/main.js',
    '/PWA_design-onchange/manifest.json',
    '/PWA_design-onchange/cofficients.csv',
    '/PWA_design-onchange/questions.csv',
    '/PWA_design-onchange/tales.csv',
    '/PWA_design-onchange/images'
];

// インストール処理
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});