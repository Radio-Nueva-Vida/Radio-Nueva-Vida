// 1. DEFINICIÓN DE CONSTANTES
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
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
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

// 4. LÓGICA DE METADATOS CON SHOUTCAST ICY
let parser;

audio.addEventListener('play', () => {
  if (!parser) {
    parser = new ShoutcastMetadataParser(audio);
    parser.addEventListener('metadata', async (event) => {
      const streamTitle = event.detail.StreamTitle || "";
      const [artist, title] = streamTitle.split(" - ").map(s => s.trim());

      artistaEl.textContent = artist || "Desconocido";
      tituloEl.textContent = title || "Sin título";

      if (artist && title) {
        try {
          const query = encodeURIComponent(`${artist} ${title}`);
          const itunesRes = await fetch(`https://itunes.apple.com/search?term=${query}&limit=1`);
          const itunesData = await itunesRes.json();
          if (itunesData.results && itunesData.results.length > 0) {
            const artwork = itunesData.results[0].artworkUrl100;
            albumArt.src = artwork.replace("100x100", "512x512");
          } else {
            albumArt.src = "placeholder.png";
          }
        } catch {
          albumArt.src = "placeholder.png";
        }
      } else {
        albumArt.src = "placeholder.png";
      }
    });
  }
});
