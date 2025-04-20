const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const iconoPlay = document.getElementById("iconoPlay");
const iconoPause = document.getElementById("iconoPause");
const artistElement = document.getElementById("artist");
const titleElement = document.getElementById("title");
const coverElement = document.getElementById("cover");
const volumeControl = document.getElementById("volumeControl");

// Reproducir o pausar al hacer clic en el botón
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().then(() => {
      iconoPlay.style.display = "none";
      iconoPause.style.display = "inline";
    }).catch(err => {
      console.error("Error al reproducir:", err);
    });
  } else {
    audio.pause();
    iconoPlay.style.display = "inline";
    iconoPause.style.display = "none";
  }
});

// Control de volumen
volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Limpiar etiquetas HTML de texto
function limpiarTexto(texto) {
  return texto.replace(/<\/?.+?>/g, "").trim();
}

// Obtener metadatos desde el proxy
async function obtenerMetadata() {
  try {
    const res = await fetch("https://proxy-metadatos.onrender.com/metadata");
    const texto = await res.text();
    const partes = texto.split(",");
    if (partes.length > 6) {
      const [artista, titulo] = partes[6].split(" - ");
      const artistaLimpiado = limpiarTexto(artista || "Desconocido");
      const tituloLimpiado = limpiarTexto(titulo || "Desconocido");

      artistElement.textContent = artistaLimpiado;

      if (tituloLimpiado.toLowerCase() !== "desconocido") {
        titleElement.textContent = tituloLimpiado;
        titleElement.style.display = "block";
      } else {
        titleElement.style.display = "none";
      }

      buscarPortada(`${artistaLimpiado} ${tituloLimpiado}`);
    }
  } catch (err) {
    console.error("Error al obtener metadata", err);
    artistElement.textContent = "Desconocido";
    titleElement.textContent = "Sin información";
    titleElement.style.display = "block";
    coverElement.src = "placeholder.png";
  }
}

// Buscar portada con fallback (iTunes + MusicBrainz)
async function buscarPortada(query) {
  try {
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1`);
    const itunesData = await itunesRes.json();

    if (itunesData.results?.length > 0 && itunesData.results[0].artworkUrl100) {
      coverElement.src = itunesData.results[0].artworkUrl100.replace("100x100bb.jpg", "512x512bb.jpg");
      return;
    }

    const mbRes = await fetch(`https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json`);
    const mbData = await mbRes.json();

    if (mbData.releases?.length > 0) {
      const releaseId = mbData.releases[0].id;
      const coverUrl = `https://coverartarchive.org/release/${releaseId}/front`;
      const coverCheck = await fetch(coverUrl, { method: "HEAD" });
      if (coverCheck.ok) {
        coverElement.src = coverUrl;
        return;
      }
    }

    coverElement.src = "placeholder.png";
  } catch (e) {
    console.error("Error buscando carátula:", e);
    coverElement.src = "placeholder.png";
  }
}

setInterval(obtenerMetadata, 15000);
obtenerMetadata();
