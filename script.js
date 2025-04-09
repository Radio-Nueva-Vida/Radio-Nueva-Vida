const button = document.getElementById('play-button');
let audio = new Audio('https://usa13.fastcast4u.com/proxy/nuevavidaonline?mp=/1');
let playing = false;

button.addEventListener('click', () => {
  if (!playing) {
    audio.play();
    button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    playing = true;
  } else {
    audio.pause();
    button.style.backgroundColor = 'transparent';
    playing = false;
  }
});