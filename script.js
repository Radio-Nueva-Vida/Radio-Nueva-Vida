
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPause");
const iconoPlay = document.getElementById("iconoPlay");
const iconoPause = document.getElementById("iconoPause");
const volumen = document.getElementById("volumen");

const artista = document.getElementById("artista");
const titulo = document.getElementById("titulo");
const albumArt = document.getElementById("album-art");

let isPlaying = false;

// URL del proxy en Render
const URL_PROXY = "https://proxy-metadatos-ugf5.onrender.com";

// Reproducir / Pausar
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    iconoPlay.style.display = "inline";
    iconoPause.style.display = "none";
  } else {
    audio.play();
    iconoPlay.style.display = "none";
    iconoPause.style.display = "inline";
  }
  isPlaying = !isPlaying;
});

// Control de volumen
volumen.addEventListener("input", () => {
  audio.volume = volumen.value;
});

// Limpiar posibles etiquetas HTML o basura en el texto recibido
