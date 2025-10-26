// 1. DEFINICIÓN DE CONSTANTES
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const artistaEl = document.getElementById("artist");
const tituloEl = document.getElementById("title");
const albumArt = document.getElementById("cover");
const volumenControl = document.getElementById("volumeControl");
const playIcon = document.getElementById("iconoPlay");
const pauseIcon = document.getElementById("iconoPause");

// 2. CONTROL DE REPRODUCCIÓN
playPauseBtn.addEventListener("click", () => {
  audio.paused ? audio.play() : audio.pause();
});

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

// 4. LÓGICA DE METADATOS CON FALLBACK DE IMAGEN
async function obtenerMetadata() {
  try {
    const res = await fetch("https://proxy-metadatos.onrender.com/metadata");
    const data = await res.json();

    const artista = data.artist || "Desconocido";
    const titulo = data.title || "Sin título";

    document.getElementById("artist").textContent = artista;
    document.getElementById("title").textContent = titulo;

    // Buscar carátula en iTunes
    const query = encodeURIComponent(`${artista} ${titulo}`);
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
    const itunesData = await itunesRes.json();

    if (itunesData.results && itunesData.results.length > 0) {
      const artwork = itunesData.results[0].artworkUrl100;
      document.getElementById("cover").src = artwork.replace("100x100", "512x512");
    } else {
      // 🎨 Imagen genérica gospel de respaldo
      document.getElementById("cover").src = "coversgospelgeneric.png";
    }
  } catch (error) {
    console.error("Error obteniendo metadatos:", error);
    document.getElementById("artist").textContent = "Desconocido";
    document.getElementById("title").textContent = "Sin información";
    // Si hay error, mostrar también la portada genérica
    document.getElementById("cover").src = "coversgospelgeneric.png";
  }
}

// Ejecutar al inicio y cada 7 segundos
obtenerMetadata();
setInterval(obtenerMetadata, 7000);

// 5. FUNCIÓN PARA OBTENER CARÁTULA (iTunes → Last.fm → Genérico)
async function obtenerCaratula(artist, title) {
  try {
    // 🔹 1. Buscar en iTunes
    const query = encodeURIComponent(`${artist} ${title}`);
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
    const itunesData = await itunesRes.json();

    if (itunesData.results && itunesData.results.length > 0) {
      const artwork = itunesData.results[0].artworkUrl100;
      return artwork.replace("100x100", "512x512");
    }

    // 🔹 2. Buscar en Last.fm (sin API key, usando su proxy público)
    const lastfmRes = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=cb51c3edc6a20efb0d7b7a8e8c9c25aa&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`);
    const lastfmData = await lastfmRes.json();

    if (lastfmData?.track?.album?.image?.length > 0) {
      // Buscar la imagen de mayor tamaño disponible
      const images = lastfmData.track.album.image;
      const largeImage = images[images.length - 1]["#text"];
      if (largeImage) return largeImage;
    }

    // 🔹 3. Imagen genérica
    return "covers/gospel-generic.png";
  } catch (err) {
    console.error("Error obteniendo carátula:", err);
    return "covers/gospel-generic.png";
  }
}

// 6. ACTUALIZACIÓN PERIÓDICA
obtenerMetadata();
setInterval(obtenerMetadata, 7000);
