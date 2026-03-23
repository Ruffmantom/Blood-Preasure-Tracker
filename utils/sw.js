var cacheName = "bpt-v-2.0.3";
var filesToCache = [
  "../",
  "../index.html",
  "../styles/other.css",
  "../js/libraries/icons.js",
  "../js/libraries/jquery.js",
  "../js/libraries/tailwind.js",
  "../js/components.js",
  "../js/helpers.js",
  "../js/index.js",
  "../js/app.js",
  "../assets/images/bp-tracker-48.png",
  "../assets/images/bp-tracker-48.webp",
  "../assets/images/bp-tracker-72.png",
  "../assets/images/bp-tracker-96.png",
  "../assets/images/bp-tracker-128.png",
  "../assets/images/bp-tracker-256.png",
  "../assets/images/bp-tracker-rounded-256.ico",
  "../assets/images/bp-tracker-rounded-256.png",
  "../fonts/digital-7-mono.ttf",
  "../fonts/digital-7.ttf",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(async function (cache) {
      for (const file of filesToCache) {
        try {
          const response = await fetch(file);
          console.log("Caching:", file, response.status);

          if (!response.ok) {
            throw new Error(`Bad response for ${file}: ${response.status}`);
          }

          await cache.put(file, response.clone());
        } catch (err) {
          console.error("Failed to cache:", file, err);
          throw err;
        }
      }
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