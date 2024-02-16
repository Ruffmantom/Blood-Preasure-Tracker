var cacheName = "bp-app-v1";
var filesToCache = [
  "../",
  "../index.html",
  "../css/clear.css",
  "../css/ruffstyles.css",
  "../css/style.css",
  "../js/createHtml.js",
  "../js/helpers.js",
  "../js/index.js",
  "../assets/images/mybp-app-logo.png",
  "../assets/images/mybp-app-logo.webp",
  "../assets/icons/mybp-app-logo-72x72.ico",
  "../assets/icons/mybp-app-logo-96x96.ico",
  "../assets/icons/mybp-app-logo-128x128.ico",
  "../assets/icons/mybp-app-logo-256x256.ico"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});
/* Serve cached content when offline */
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});