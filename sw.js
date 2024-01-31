const version = 1;
const cacheName = `friday-${version}`; //the name of our domain cache
const imgCacheName = `${cacheName}-images`; //cache for images fetched from a remote domain
const precacheResources = ['/css/main.css']; //the cache will resources from OUR OWN domain

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precacheResources);
      //save the files from our domain to the cache
    })
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then((keys) => {
      //clear out old versions of OUR domain cache AND the image cache
      return Promise.all(keys.filter((key) => key !== cacheName && key !== imgCacheName).map((key) => caches.delete(key)));
    })
  );
});

self.addEventListener('fetch', (ev) => {
  //what do we want to cache? fetch? both?
  const request = ev.request;
  const url = new URL(request.url); //to get the parts of the url
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
