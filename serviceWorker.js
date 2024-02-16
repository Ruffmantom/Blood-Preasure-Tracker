const staticDevBp = "bp-site-v1"
const assets = [
  "/",
  "/index.html",
  "/css/clear.css",
  "/css/ruffstyles.css",
  "/css/style.css",
  "/js/createHtml.js",
  "/js/helpers.js",
  "/js/index.js",
  "/assets/images/mybp-app-logo.png",
  "/assets/images/mybp-app-logo.webp",
  "/assets/icons/mybp-app-logo-72x72.ico",
  "/assets/icons/mybp-app-logo-96x96.ico",
  "/assets/icons/mybp-app-logo-128x128.ico",
  "/assets/icons/mybp-app-logo-256x256.ico"

]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevBp).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});