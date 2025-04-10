const boton = document.getElementById("reproducirPausa");
const audio = document.getElementById("audio");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");

boton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    audio.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
});
