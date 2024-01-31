const version = 1;
const cacheName = `friday-${version}`;
const imgCacheName = `${cacheName}-images-${version}`;
const precacheResources = [];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precacheResources);
    })
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== cacheName && key !== imgCacheName).map((key) => caches.delete(key)));
    })
  );
});

self.addEventListener('fetch', (ev) => {
  //what do we want to cache? fetch? both?
});

self.addEventListener('message', (ev) => {
  //message received from client
  console.log(ev.data);
});

function sendMessage(message) {
  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(message));
  });
}
