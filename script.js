const radio = document.getElementById('radio');
const btn = document.querySelector('.play-btn');
let playing = false;

function togglePlay() {
  if (playing) {
    radio.pause();
    btn.textContent = '▶';
  } else {
    radio.play();
    btn.textContent = '⏸';
  }
  playing = !playing;
}
