(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  //add click listener to send a message
  document.querySelector('main > h2').addEventListener('click', handleClick);

  document.querySelector('header > h1').addEventListener('click', () => {
    //if you click on the h1... send a message to the service worker
    let msg = {
      action: 'hello',
      num: Math.floor(Math.random() * 100) + 1, // 1 - 100
    };
    console.log(msg);
    sendMessage(msg);
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
    //reg.active is the current service worker in control
    reg.active.postMessage(msg);
  });
}

function receiveMessage(ev) {
  //receive a message from the service worker
  console.log(ev.data); //data is the message object
  let p = document.createElement('p');
  p.textContent = ev.data;
  document.querySelector('main').append(p);

  // let url = 'http://127.0.0.1:5333/index.html?id=' + ev.data.id; //page reloads

  let url = location.origin + '/#id=' + ev.data.id; //page does NOT reload
  location.assign(url);
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
