var cacheName = "bp-app-v7";
var filesToCache = [
  "../",
  "../index.html",
  "../styles/other.css",
  "../js/createHtml.js",
  "../js/libraries/icons.js",
  "../js/libraries/jquery.js",
  "../js/libraries/tailwind.js",
  "../js/components.js",
  "../js/helpers.js",
  "../js/app.js",
  "../assets/images/bp-tracker-48.png",
  "../assets/images/bp-tracker-48.webp",
  "../assets/images/bp-tracker-72.png",
  "../assets/images/bp-tracker-96.png",
  "../assets/images/bp-tracker-128.png",
  "../assets/images/bp-tracker-256.png",
  "../assets/images/bp-tracker-rounded-256.ico",
  "../assets/images/bp-tracker-rounded-256.png",
  "../assets/fonts/digital-7 (mono).ttf",
  "../assets/fonts/digital-7.ttf",
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