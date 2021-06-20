const socket = io("/");
// Меню (мобильная версия)
document.querySelector('.header__burger-menu').addEventListener('click', function() {
  let header__box = document.querySelector('.header__box');
  if (!header__box.classList.contains('header__box-active')){
    header__box.classList.add('header__box-active')
    //Анимация
    let start = Date.now();
    let timer = setInterval(function() {
      let timePassed = Date.now() - start;
      document.querySelector('.header__box-active').style.top = timePassed / 5 + 'px';
      if (timePassed >= 440) clearInterval(timer);
    }, 20);
    // смена значка
    this.lastElementChild.remove();
    this.firstElementChild.style = 'transform: rotate(45deg)';
    this.lastElementChild.style = 'margin-top: -2px; transform: rotate(-45deg)';
  } else {
    header__box.classList.remove('header__box-active');
    // смена значка
    this.firstElementChild.style = 'transform: rotate(0)';
    this.lastElementChild.style = 'margin-top: 5px; transform: rotate(0deg)';
    this.append(document.createElement('div'))
  }

})


// Настройка табов
let jsLinks = document.querySelectorAll('.js-communicate-items-link')
let jsPanes = document.querySelectorAll('.js-communicate-items-pane')

jsLinks.forEach(function(link){
  link.addEventListener('click', function(){
    if(this.classList.contains('active')){
      return
    }
    let id = this.getAttribute('data-tab'),
        pane = document.querySelector('.js-communicate-items-pane[data-tab="'+id+'"]')
        activeLink = document.querySelector('.js-communicate-items-link.active')
        activePane = document.querySelector('.js-communicate-items-pane.active')
    
    activeLink.classList.remove('active')
    link.classList.add('active')

    activePane.classList.remove('active');
    pane.classList.add('active');

  })
})

// PeerJs
const peer = new Peer(undefined, {host:'peerjs.herokuapp.com', secure:true, port:443})
const peers = {}
const videoGrid = document.querySelector('.content-video-grid');
const myVideo = document.createElement("video");

const myShare = document.createElement("video");
console.log(peer);

const ROOM_ID = '123';
const userName = document.querySelector('.user__name').textContent;

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, userName);
});

// Работа с WebRTC
let constraints = {audio: false, video: true};
// let startRTC = document.querySelector('.content-video-start')
// if(startRTC){
//   startRTC.addEventListener('click', ()=> {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      addVideoStream(myVideo, mediaStream);
      // let video = document.querySelector('video');
      // video.srcObject = mediaStream;
      // video.onloadedmetadata = function(e) {
      //   video.play();
      // };
      peer.on("call", (call) => {
        console.log(call, "call here");
        call.answer(mediaStream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
        call.on('close', () => {
          video.remove()
        })
        peers[call.peer] = call
      });
      socket.on("user-connected", (userId) => {
        console.log('user coonected', userId)
        connectToNewUser(userId, mediaStream);
      });
      console.log(peer)
    })
    .catch(function(err) { 
      console.log(err.name + ": " + err.message); 
    }); 
//   })
// }


socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

let shareRTC = document.querySelector('.content-functions-share')
if(shareRTC){
  shareRTC.addEventListener('click', startCapture);
}
let captureStream = null;
async function startCapture(displayMediaOptions) {
  

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    console.log(captureStream);
    addVideoStream(myShare, captureStream);
    // let content_video_grid = document.querySelector('.content-video-grid');
    // let video = document.createElement('video')
    // content_video_grid.append(video)
    // video.srcObject = captureStream;
    // video.onloadedmetadata = function(e) {
    //   video.play();
    // };
    // Редактировать, но работает
    // socket.emit('share');
    // socket.on('user-share', (userId) => {
      console.log(peers);
      for(key in peers){
        let call = peer.call(key, captureStream);
        console.log(call);
      }
      // const share = document.createElement("video");
      // addVideoStream(share, captureStream);
      console.log('ok');
    // })

    captureStream.getVideoTracks()[0].addEventListener('ended', () => {
      // редактировать
      myShare.parentNode.removeChild(myShare);
    });
  } catch(err) {
    console.error("Error: " + err);
  }
  return captureStream;
}



const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  console.log(call);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove()
  })
  peers[userId] = call
};



// Сокеты - чат
// socket.on("message", (userId) => {
//   console.log('user connected', userId)
// });


let messages = [];
let sendButton = document.querySelector('.chat-input-send');
let inputMessage = document.querySelector('.chat-input-message');
let chatWindow = document.querySelector('.chat-window');

if(sendButton){
  sendButton.addEventListener('click', sendMessage);
}
function sendMessage(){
  if (inputMessage.value.length !== 0) {
    socket.emit("message", inputMessage.value);
    inputMessage.value = "";
  }
}

socket.on("createMessage", (message, userName) => {
  chatWindow.innerHTML =
    chatWindow.innerHTML +
    `<div class="message">
        <b> <i><span> ${userName}: </span> </i> </b>
        <span>${message}</span>
    </div>`;
});

// Вывод времени в комнате
// let countTime = document.querySelector('.room-page__block-time');
// startCountTime();
function startCountTime() {
  countTime.style.display = "inline";
  callStartTime = Date.now();
  setInterval(function printTime() {
    callElapsedTime = Date.now() - callStartTime;
    countTime.innerHTML = getTimeToString(callElapsedTime);
  }, 1000);
}
function getTimeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);
  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);
  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);
  let formattedHH = hh.toString().padStart(2, "0");
  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  return `${formattedHH}:${formattedMM}:${formattedSS}`;
}
