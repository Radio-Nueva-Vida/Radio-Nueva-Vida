const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn"); 
const artistaEl = document.getElementById("artist"); 
const tituloEl = document.getElementById("title"); 
const albumArt = document.getElementById("cover");
const volumenControl = document.getElementById("volumeControl"); 

const playIcon = document.getElementById("iconoPlay");
const pauseIcon = document.getElementById("iconoPause");

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    // Si está en pausa, intentamos reproducir y mostramos el ícono de pausa.
    audio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  } else {
    // Si está reproduciendo, pausamos y mostramos el ícono de play.
    audio.pause();
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  }
});

// Consejo: También puedes añadir listeners a los eventos 'play' y 'pause' del audio
// para manejar cambios si el audio se detiene por otras razones (ej. error de red).

audio.addEventListener('play', () => {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
});

audio.addEventListener('pause', () => {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
});
// -------------------------------------------------------------
// Lógica para Reproducir/Pausar y para el Volumen (Funcional)
// -------------------------------------------------------------

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

volumenControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// -------------------------------------------------------------
// Lógica para Obtener y Mostrar Metadatos (Funcional)
// -------------------------------------------------------------

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

setInterval(obtenerMetadata, 15000);
obtenerMetadata();
