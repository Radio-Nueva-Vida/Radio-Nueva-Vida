
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const icon = document.getElementById("icon");
const artistElement = document.getElementById("artist");
const titleElement = document.getElementById("title");
const coverElement = document.getElementById("cover");

playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    icon.textContent = "❚❚";
  } else {
    audio.pause();
    icon.textContent = "►";
  }
});

document.getElementById("volumeControl").addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

function limpiarTexto(texto) {
  return texto.replace(/<\/?.+?>/g, "").trim();
}

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
    // Podrías añadir aquí un manejo para mostrar información por defecto en caso de error
    artistElement.textContent = "Desconocido";
    titleElement.textContent = "Sin información";
    titleElement.style.display = "block";
    coverElement.src = "placeholder.png";
  }
}

async function buscarPortada(query) {
  try {
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1`);
    const itunesData = await itunesRes.json();

    if (itunesData.results && itunesData.results.length > 0 && itunesData.results[0].artworkUrl100) {
      coverElement.src = itunesData.results[0].artworkUrl100.replace('100x100bb.jpg', '512x512bb.jpg'); // Intenta obtener una imagen más grande
      return;
    }

    const mbRes = await fetch(`https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json`);
    const mbData = await mbRes.json();

    if (mbData.releases && mbData.releases.length > 0 && mbData.releases[0]['cover-art-archive']?.front) {
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