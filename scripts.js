$(document).ready(function() {
    console.log("Página de Radio Nueva Vida cargada correctamente.");
    // Puedes agregar más interactividad aquí.
});
$(document).ready(function() {
    const audioPlayer = $('audio')[0]; // Selecciona el reproductor de audio
    audioPlayer.onplay = function() {
        console.log("Reproducción iniciada");
    };
    audioPlayer.onpause = function() {
        console.log("Reproducción pausada");
    };
});
$(document).ready(function() {
    $('#title').hide().fadeIn(2000); // El título aparecerá con un efecto de desvanecimiento
});
$(document).ready(function() {
    console.log("Página de Radio Nueva Vida cargada correctamente.");
    
    // Agregar un mensaje de bienvenida al cargar la página
    $('#header-section').append('<p style="font-size: 1.2rem; color: #fff;">Escucha la mejor música cristiana online. ¡Todo el Día...Junto a Vos!</p>');
});

audioPlayer.addEventListener('play', () => {
    audioContext.resume(); // Activar contexto de audio
    updateVuMeters(); // Iniciar vúmetros
});

audioPlayer.addEventListener('pause', () => {
    audioContext.suspend(); // Detener contexto de audio
});

const audioPlayer = new Audio('shaincast.caster.fm:48858/listen.mp3'); // Coloca aquí la URL de tu stream
audioPlayer.crossOrigin = "anonymous"; // Permite que funcione con streams externos

const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Crear contexto de audio
const analyser = audioContext.createAnalyser(); // Crear analizador
const source = audioContext.createMediaElementSource(audioPlayer); // Conectar reproductor
source.connect(analyser);
analyser.connect(audioContext.destination);

const bars = document.querySelectorAll('.bar'); // Seleccionar las barras en tu HTML
analyser.fftSize = 256; // Tamaño del análisis
const bufferLength = analyser.frequencyBinCount; // Cantidad de datos de frecuencia
const dataArray = new Uint8Array(bufferLength);

function updateVuMeters() {
    analyser.getByteFrequencyData(dataArray); // Obtener datos del volumen
    bars.forEach((bar, index) => {
        const volume = dataArray[index];
        bar.style.height = `${volume / 2}px`; // Ajustar altura basada en el volumen
    });
    requestAnimationFrame(updateVuMeters); // Animación continua
}

audioPlayer.addEventListener('play', () => {
    audioContext.resume(); // Activar el contexto
    updateVuMeters(); // Iniciar la animación de las barras
});

audioPlayer.addEventListener('pause', () => {
    audioContext.suspend(); // Detener el contexto
});
