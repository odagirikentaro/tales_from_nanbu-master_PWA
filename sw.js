const CACHE_NAME = 'PWA_design - onchange';
const urlsToCache = [
    'index.html',
    'style.css',
    'main.js',
    'manifest.json',
    'coefficients.csv',
    'questions.csv',
    'tales.csv',
    'favicon.ico',
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg',
    'images/7.jpg',
    'images/8.jpg',
    'images/9.jpg',
    'images/10.jpg',
    'images/11.jpg',
    'images/12.jpg',
    'images/bgimage.png',
    'images/washi_bg.png',
    'images/character.png',
    'images/character_192.png',
    'images/character_512.png',
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

// キャッシュからレスポンスを返す
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});

// キャッシュのクリア
self.addEventListener("activate", (e) => {
    e.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        );
      }),
    );
  });
  
