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
  let isPicsum = url.origin.includes('picsum.photos');
  if (isPicsum) {
    console.log(url.origin); // https://picsum.photos
    ev.respondWith(
      fetch(url, {
        method: 'GET',
        credentials: 'omit', //stops the status:0 and opaque response problem
      }).catch(return404)
    );
  } else if (url.origin.includes('gstatic.com') || url.origin.includes('googleapis.com')) {
    console.log('You are asking for a google CSS or font file.');
    ev.respondWith(fetch(ev.request).catch(return404));
    //we could save these in the CACHE here too
  } else {
    ev.respondWith(fetch(ev.request).catch(return404));
    //send the file that was requested or a 404 error if anything goes wrong
  }
});

self.addEventListener('message', (ev) => {
  //message received from client
  console.log(ev.data);
  //data === line 29 in main.js msg variable
  if ('txt' in ev.data) {
    console.log('Message with txt from client', ev.source.id);
    //ev - message event
    // ev.source - is the WindowClient object who sent the message
    // ev.source.id is the id of the WindowClient
  }
  if ('num' in ev.data && Number(ev.data.num) > 50) {
    //if num is a value greater than 50...
    //send a message back
    let msg = {
      num: ev.data.num * 2,
      sender: ev.source.id,
    };
    sendMessage(msg);
  }
});

function sendMessage(message) {
  //message {num: 88, sender: 'jg2jh3j2hg42j3hg42j3h4g2j3gh42j3hg4j'}
  // self - the service worker
  // self.clients - access ALL the tabs/windows using this service worker
  // self.clients.matchAll() - async task to get the list of clients

  return self.clients.matchAll().then((clients) => {
    console.log('there are', clients.length, 'tabs or windows');

    clients.forEach((client) => {
      if (client.id === message.sender) {
        client.postMessage(message);
      } else {
        client.postMessage('This message was NOT for you');
      }
    });
  });
}

function return404(err) {
  return new Response(null, { status: 404 });
}
