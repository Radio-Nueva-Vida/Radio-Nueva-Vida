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

$(document).ready(function() {
    // Inicialización del reproductor de audio
    const audioPlayer = new Audio('https://shaincast.caster.fm:48858/listen.mp3'); // URL del stream
    audioPlayer.crossOrigin = "anonymous";

    // Configuración de la Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Configuración de los vúmetros
    const bars = document.querySelectorAll('.bar');
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function updateVuMeters() {
        analyser.getByteFrequencyData(dataArray);
        bars.forEach((bar, index) => {
            const volume = dataArray[index];
            bar.style.height = `${volume / 2}px`;
        });
        requestAnimationFrame(updateVuMeters);
    }

    // Eventos de reproducción y pausa
    audioPlayer.addEventListener('play', () => {
        audioContext.resume();
        updateVuMeters();
        console.log('Reproducción iniciada');
    });

    audioPlayer.addEventListener('pause', () => {
        audioContext.suspend();
        console.log('Reproducción pausada');
    });

    // Para probar: Reproducir automáticamente al cargar la página
    audioPlayer.play();
});
