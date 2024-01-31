(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  //add click listener to send a message
  document.querySelector('main > h2').addEventListener('click', handleClick);

  //add message listener to receive messages
  window.addEventListener('message', receiveMessage);
})();

function sendMessage(msg) {
  //send a message to the service worker
}

function receiveMessage(msg) {
  //receive a message from the service worker
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
