// 1. CONSTANTES
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const artistaEl = document.getElementById("artist");
const tituloEl = document.getElementById("title");
const albumArt = document.getElementById("cover");
const volumenControl = document.getElementById("volumeControl");
const playIcon = document.getElementById("iconoPlay");
const pauseIcon = document.getElementById("iconoPause");

// Portada oficial personalizada (CAMBIA EL NOMBRE SI HACE FALTA)
const PORTADA_DEFAULT = "coversgospelgeneric.png";

// -----------------------------------------------------------
// 2. REPRODUCCIÓN
// -----------------------------------------------------------
playPauseBtn.addEventListener("click", () => {
  audio.paused ? audio.play() : audio.pause();
});

audio.addEventListener("play", () => {
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
});

audio.addEventListener("pause", () => {
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
});

// -----------------------------------------------------------
// 3. VOLUMEN
// -----------------------------------------------------------
volumenControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// -----------------------------------------------------------
// 4. METADATOS SONICPANEL
// -----------------------------------------------------------
const METADATA_URL = "https://server.streamcasthd.com/cp/get_info.php?p=8626";

async function obtenerMetadata() {
  try {
    const res = await fetch(METADATA_URL);
    const data = await res.json();

    const titulo = data.title || "";
    const portadaSP = data.art || "";

    let artista = "";
    let cancion = "";

    // Formato: "Artista - Canción"
    if (titulo.includes(" - ")) {
      const partes = titulo.split(" - ");
      artista = partes[0].trim();
      cancion = partes[1].trim();
    }

    // Mostrar limpio, sin textos feos
    artistaEl.textContent = artista;
    tituloEl.textContent = cancion;

    // Si SonicPanel trae portada → usarla
    if (portadaSP && portadaSP !== "" && portadaSP !== "No Image") {
      albumArt.src = portadaSP;
      return;
    }

    // Caso contrario → buscar fallback externo
    const caratula = await obtenerCaratula(artista, cancion);

    // Si viene vacía → usar la predeterminada
    albumArt.src = caratula || PORTADA_DEFAULT;

  } catch (error) {
    console.error("Error obteniendo metadatos SonicPanel:", error);
    artistaEl.textContent = "";
    tituloEl.textContent = "";
    albumArt.src = PORTADA_DEFAULT;
  }
}

// -----------------------------------------------------------
// 5. FUNCIÓN DE CARÁTULA (iTunes → LastFM → Portada default)
// -----------------------------------------------------------
async function obtenerCaratula(artist, title) {
  try {
    if (!artist || !title) return PORTADA_DEFAULT;

    // iTunes
    const query = encodeURIComponent(`${artist} ${title}`);
    const itRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
    const itData = await itRes.json();

    if (itData.results?.length > 0) {
      const url = itData.results[0].artworkUrl100.replace("100x100", "512x512");
      return url;
    }

    // LastFM
    const lfRes = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=cb51c3edc6a20efb0d7b7a8e8c9c25aa&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`
    );
    const lfData = await lfRes.json();

    const img = lfData?.track?.album?.image?.slice(-1)[0]["#text"];
    if (img) return img;

    // Fallback final
    return PORTADA_DEFAULT;

  } catch (err) {
    console.error("Fallback error:", err);
    return PORTADA_DEFAULT;
  }
}

// -----------------------------------------------------------
// 6. FALLBACK SI LA IMAGEN FALLA AL CARGAR
// -----------------------------------------------------------
albumArt.onerror = () => {
  albumArt.src = PORTADA_DEFAULT;
};

// -----------------------------------------------------------
// 7. ACTUALIZACIÓN AUTOMÁTICA
// -----------------------------------------------------------
obtenerMetadata();
setInterval(obtenerMetadata, 10000);

