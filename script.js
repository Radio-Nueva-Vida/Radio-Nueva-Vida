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

// Variable para guardar la última carátula válida
let ultimaCaratula = "placeholder.png";

// 2. FUNCIÓN DE REPRODUCCIÓN Y CONTROL DE ÍCONOS
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
});

audio.addEventListener("pause", () => {
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
});

// 3. CONTROL DE VOLUMEN
volumenControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// 4. LÓGICA DE METADATOS
let ultimoArtista = "";
let ultimoTitulo = "";
let ultimaCaratula = "placeholder.png"; // carátula por defecto

async function obtenerMetadata() {
  try {
    // ✅ Forzar actualización sin caché
    const res = await fetch(`https://proxy-metadatos-ugf5.onrender.com/metadata?_=${Date.now()}`, {
      cache: "no-store"
    });
    const data = await res.json();

    let artist = data.artist ? data.artist.trim() : "";
    let title = data.title ? data.title.trim() : "";

    // 🔹 Corrección 1: Si viene en un solo campo, intentar separar por " - "
    if (!artist && title.includes(" - ")) {
      const partes = title.split(" - ");
      artist = partes[0]?.trim();
      title = partes[1]?.trim() || "";
    }

    // 🔹 Corrección 2: Detectar si el orden está invertido (p. ej. "Canción - Artista")
    if (title && artist && title.split(" ").length < artist.split(" ").length) {
      if (artist.toLowerCase().includes("desconocido") || !artist) {
        const temp = artist;
        artist = title;
        title = temp;
      }
    }

    // 🔹 Corrección 3: Evitar mostrar "Desconocido" o vacíos
    if (!artist || artist.toLowerCase().includes("desconocido")) artist = "";
    if (!title || title.toLowerCase().includes("desconocido") || title.toLowerCase().includes("sin título")) title = "";

    // 🔹 Nueva mejora: Evitar actualizar si no hay cambios reales
    if (artist === ultimoArtista && title === ultimoTitulo) return;

    ultimoArtista = artist;
    ultimoTitulo = title;

    // Actualizar los campos visibles
    artistaEl.textContent = artist || " ";
    tituloEl.textContent = title || " ";

    // 🔹 Corrección 4: Buscar carátula solo si los datos son válidos
    if (artist.trim() && title.trim()) {
      const query = encodeURIComponent(`${artist} ${title}`);
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
      const itunesData = await itunesRes.json();

      if (itunesData.results && itunesData.results.length > 0) {
        const artwork = itunesData.results[0].artworkUrl100.replace("100x100", "512x512");
        albumArt.src = artwork;
        ultimaCaratula = artwork; // guardamos la última válida
      } else {
        albumArt.src = ultimaCaratula; // mantenemos la anterior
      }
    } else {
      albumArt.src = ultimaCaratula; // mantenemos la anterior si no hay título válido
    }

  } catch (error) {
    console.error("Error obteniendo metadatos:", error);
    artistaEl.textContent = " ";
    tituloEl.textContent = " ";
    albumArt.src = ultimaCaratula;
  }
}

// Iniciar la obtención de metadatos y establecer el intervalo
obtenerMetadata();
setInterval(obtenerMetadata, 15000);
