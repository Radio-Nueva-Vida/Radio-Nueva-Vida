const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPause");
const iconoPlay = document.getElementById("iconoPlay");
const iconoPause = document.getElementById("iconoPause");
const artistaEl = document.getElementById("artista");
const tituloEl = document.getElementById("titulo");
const albumArt = document.getElementById("album-art");
const volumenControl = document.getElementById("volumen");

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    iconoPlay.style.display = "none";
    iconoPause.style.display = "inline";
  } else {
    audio.pause();
    iconoPlay.style.display = "inline";
    iconoPause.style.display = "none";
  }
});

volumenControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

async function obtenerMetadata() {
  try {
    const res = await fetch("https://proxy-metadatos-ugf5.onrender.com/metadata");
    const data = await res.json();

    artistaEl.textContent = data.artist || "Desconocido";
    tituloEl.textContent = data.title || "Sin título";

    const query = encodeURIComponent(`${data.artist} ${data.title}`);
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
    const itunesData = await itunesRes.json();

    if (itunesData.results && itunesData.results.length > 0 && itunesData.results[0].artworkUrl100) {
      albumArt.src = itunesData.results[0].artworkUrl100.replace("100x100bb.jpg", "512x512bb.jpg");
    } else {
      albumArt.src = "placeholder.png";
    }
  } catch (error) {
    console.error("Error obteniendo metadatos:", error);
    artistaEl.textContent = "Desconocido";
    tituloEl.textContent = "Sin información";
    albumArt.src = "placeholder.png";
  }
}

// Actualiza metadatos cada 15 segundos
setInterval(obtenerMetadata, 15000);
obtenerMetadata();
