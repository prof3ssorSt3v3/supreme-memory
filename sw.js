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
  // https://bob.work.org/folder/file.html?hello=goodbye
  // protocol host
  if (url.origin === self.location.origin) {
    //local file (one of ours)
    ev.respondWith(
      fetch(ev.request.url, {
        method: 'GET',
      }).catch(console.warn)
    );
  } else {
    //remote from another server
    //browser sends a fetch(url, {method: 'OPTIONS'})
    //server responds to the OPTIONS /preflight request with headers that include
    // access-control-allow-origin: *
    console.log(url.origin);
    ev.respondWith(
      fetch(ev.request.url, {
        method: 'GET',
        credentials: 'omit', //solve opaque response with status code 0 issue
      })
        .then((resp) => {
          // console.log(resp.status);
          // console.log(resp.headers.get('content-type')); //mime-type
          // console.log(resp.headers.get('content-length')); //file size
          // console.log(resp.headers.get('access-control-allow-origin'));

          return resp;
        })
        .catch(console.warn)
    );
  }
});

self.addEventListener('message', (ev) => {
  //message received from client line 31 in main.js
  // console.log(ev.data); // ev.data === msg
  if ('action' in ev.data) {
    console.log(ev.data.action); //hello
  }
  if ('num' in ev.data && Number(ev.data.num) > 50) {
    console.log(ev.data.num);
    let msg = {
      txt: 'Thanks for the really big number',
      id: ev.source.id,
    };
    sendMessage(msg);
  }
});

function sendMessage(message) {
  //self - service worker
  // self.clients - list of all the tabs & windows using self
  // .matchAll() Promise containing the list of clients
  return self.clients.matchAll().then((clients) => {
    console.log(clients.length, 'clients currently');

    clients.forEach((client) => {
      // if (client.id !== message.id) {
      //only to the sender
      client.postMessage(message);
      //this is sending the message
      // } else {
      //not the sender
      // client.postMessage('I am NOT talking to you. Shut up.');
      // }
    });
  });
}
