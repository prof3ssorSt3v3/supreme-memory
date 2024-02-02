(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  //add click listener to send a message
  document.querySelector('main > h2').addEventListener('click', handleClick);

  document.getElementById('eduardo').addEventListener('click', (ev) => {
    //click on the paragraph to replace the current page.
    //With a new (search) query string - actually reloads the page
    let urlQ = location.origin + '/index.html?num=' + Math.random().toString(16);
    //With a new hash value - might not load the page
    let urlH = location.origin + '/index.html#num=' + Math.random().toString(16); //random HEX string

    location.assign(urlH);
  });

  window.addEventListener('hashchange', (ev) => {
    console.log('HASHCHANGE EVENT'); //triggered by the hash value changing
    // history.pushState({}, null, location.origin + '/yippee/yahoo');
  });
  window.addEventListener('popstate', (ev) => {
    console.log('POPSTATE'); //triggered by a change to what is written in the url
  });

  //onload - the page loaded
  //DOMContentLoaded - the DOM loaded again
  //pageshow - a new page was loaded

  document.querySelector('header > h1').addEventListener('click', (ev) => {
    let message = {
      txt: 'Hello from the main.js file',
      num: Math.floor(Math.random() * 100) + 1, // 1 - 100
    };
    sendMessage(message);
  });

  //add message listener to receive messages
  navigator.serviceWorker.addEventListener('message', receiveMessage);

  //window.location.assign('some url'); //same as clicking a link for current page
  //window.open('some url', '_blank', {}); //open a new window/tab
  //https://developer.mozilla.org/en-US/docs/Web/API/Window/open
})();

function sendMessage(msg) {
  //send a message to the service worker
  navigator.serviceWorker.ready.then((reg) => {
    //send {msg} to the service worker that is in charge "active"
    console.log('sending msg to sw');
    reg.active.postMessage(msg);
  });
}

function receiveMessage(ev) {
  //receive a message from the service worker
  console.log('MSG', ev.data);
}

function handleClick(ev) {
  //user clicked on the thing to do that thing
  const size = Math.floor(Math.random() * 500) + 100;
  const url = `https://picsum.photos/${size}/${size}/?random`;
  const img = document.createElement('img');
  const p = document.createElement('p');
  img.src = url;
  img.alt = `random image ${size}x${size}`;
  p.title = img.alt;
  p.append(img);
  document.querySelector('main').append(p);
}
