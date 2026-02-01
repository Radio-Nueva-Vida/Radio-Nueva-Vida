// 1. DEFINICIÓN DE CONSTANTES
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("playPauseBtn");
const artistaEl = document.getElementById("artist");
const tituloEl = document.getElementById("title");
const albumArt = document.getElementById("cover");
const volumenControl = document.getElementById("volumeControl");
const playIcon = document.getElementById("iconoPlay");
const pauseIcon = document.getElementById("iconoPause");

// -----------------------------------------------------------
// 2. CONTROL DE REPRODUCCIÓN
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
// 3. CONTROL DE VOLUMEN
// -----------------------------------------------------------

volumenControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// -----------------------------------------------------------
// 4. OBTENER METADATOS DESDE SONICPANEL (ArgentinaStream)
// -----------------------------------------------------------
// Endpoint oficial de SonicPanel:
const METADATA_URL = "https://server.streamcasthd.com/cp/get_info.php?p=8626";

async function obtenerMetadata() {
  try {
    const res = await fetch(METADATA_URL);
    const data = await res.json();

    // 📌 SonicPanel devuelve: title, art, bitrate, listeners, etc.
    const titulo = data.title || "Sin título";
    const portadaSP = data.art || null;

    // Formato esperado de título de SonicPanel: "Artista - Canción"
let artista = "Desconocido";
let cancion = titulo;

// Quitar números al inicio de títulos (ej: "05 Canción")
cancion = cancion.replace(/^\d+\s*/g, "").trim();

// Reset seguro sin romper el user-gesture del navegador
albumArt.removeAttribute("src");
albumArt.removeAttribute("srcset");

    if (titulo.includes(" - ") && titulo.split(" - ").length >= 2) {
      const partes = titulo.split(" - ");
      artista = partes[0].trim();
      cancion = partes[1].trim();
    }

artistaEl.textContent = artista;
tituloEl.textContent = cancion;

// 1. Define la URL de la imagen que vamos a intentar cargar (por defecto, la genérica)
let urlDePortada = "coversgospelgeneric.png";

// 2. Si SonicPanel trae portada válida → usarla
if (portadaSP && portadaSP !== "" && portadaSP !== "Sin imagen" && !portadaSP.includes("noimage")) {
  urlDePortada = portadaSP;
} else {
  // 3. ¡Si SonicPanel NO trae portada, usamos el FALLBACK DE BÚSQUEDA (iTunes/LastFM)!
  // Nota: Dado que obtenerCaratula es asíncrona, esperamos el resultado.
  try {
      urlDePortada = await obtenerCaratula(artista, cancion); // Llama a la función
  } catch(e) {
      console.warn("Fallo la búsqueda externa, usando genérica.", e);
  }
}

// 4. Configura el controlador de errores (para la carátula real o la de iTunes)
albumArt.onerror = () => {
    // Si la imagen que se asignó falla, forzamos la genérica
    albumArt.src = "coversgospelgeneric.png"; 
    albumArt.onerror = null;
};

// 5. Asigna la URL de la carátula (real, de iTunes/LastFM o genérica)
albumArt.src = urlDePortada;

  } catch (error) {
    console.error("Error obteniendo metadatos SonicPanel:", error);
    artistaEl.textContent = "Radio Nueva Vida en Vivo";
    tituloEl.textContent = "El aire que respiran tus oídos";
    albumArt.src = "coversgospelgeneric.png";
  }
}

// -----------------------------------------------------------
// 5. FUNCIÓN DE RESPALDO (iTunes → LastFM → Genérico)
// -----------------------------------------------------------

async function obtenerCaratula(artist, title) {
  try {
    // 1) iTunes
    const query = encodeURIComponent(`${artist} ${title}`);
    const itRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
    const itData = await itRes.json();

    if (itData.results?.length > 0) {
      return itData.results[0].artworkUrl100.replace("100x100", "512x512");
    }

    // 2) LastFM
    const lfRes = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=cb51c3edc6a20efb0d7b7a8e8c9c25aa&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`
    );
    const lfData = await lfRes.json();

    if (lfData?.track?.album?.image?.length > 0) {
      const images = lfData.track.album.image;
      const hd = images[images.length - 1]["#text"];
      if (hd) return hd;
    }

    // 3) Genérica
    return "coversgospelgeneric.png";

  } catch (err) {
    console.error("Fallback error:", err);
    return "coversgospelgeneric.png";
  }
}

// -----------------------------------------------------------
// 6. ACTUALIZACIÓN AUTOMÁTICA
// -----------------------------------------------------------

obtenerMetadata();
setInterval(obtenerMetadata, 30000);

// -----------------------------------------------------------
// 7. MEJORAS PARA PWA / ANDROID (NO MODIFICA LÓGICA EXISTENTE)
// -----------------------------------------------------------

// Guardar estado de reproducción
audio.addEventListener("play", () => {
  localStorage.setItem("radio_nv_playing", "true");
});

audio.addEventListener("pause", () => {
  localStorage.setItem("radio_nv_playing", "false");
});

// Reintento automático al volver a la app
document.addEventListener("visibilitychange", () => {
  if (
    document.visibilityState === "visible" &&
    localStorage.getItem("radio_nv_playing") === "true" &&
    audio.paused
  ) {
    audio.play().catch(() => {});
  }
});

// Media Session API (mejora prioridad de audio en Android)
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "Radio Nueva Vida",
    artist: "Una brújula que orienta tus sentidos hacia Dios",
    artwork: [
      { src: "logo-nueva-vida.png", sizes: "512x512", type: "image/png" }
    ]
  });

  navigator.mediaSession.setActionHandler("play", () => audio.play());
  navigator.mediaSession.setActionHandler("pause", () => audio.pause());
}
