// 1. DEFINICIÓN DE CONSTANTES (IDs CORREGIDOS)
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const artistaEl = document.getElementById("artist");
const tituloEl = document.getElementById("title");
const albumArt = document.getElementById("cover");
const volumenControl = document.getElementById("volumeControl");

// Íconos SVG para el cambio visual
const playIcon = document.getElementById("iconoPlay");
const pauseIcon = document.getElementById("iconoPause");

// 2. FUNCIÓN DE REPRODUCCIÓN Y CONTROL DE ÍCONOS
// Este listener gestiona el click y actualiza los íconos.
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Listeners para actualizar íconos basados en el estado del audio (incluso si se detiene por red)
audio.addEventListener('play', () => {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
});

audio.addEventListener('pause', () => {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
});

// 3. CONTROL DE VOLUMEN
volumenControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// 4. LÓGICA DE METADATOS
async function obtenerMetadata() {
  try {
    const res = await fetch("https://proxy-metadatos-ugf5.onrender.com/metadata");
    const data = await res.json();

    artistaEl.textContent = data.artist || "Desconocido";
    tituloEl.textContent = data.title || "Sin título";

    const query = encodeURIComponent(`${data.artist} ${data.title}`);
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
    const itunesData = await itunesRes.json();

    if (itunesData.results && itunesData.results.length > 0) {
      const artwork = itunesData.results[0].artworkUrl100;
      albumArt.src = artwork.replace("100x100", "512x512");
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

// Iniciar la obtención de metadatos y establecer el intervalo
obtenerMetadata();
setInterval(obtenerMetadata, 15000);
