$(document).ready(function () {
    console.log("Página de Radio Nueva Vida cargada correctamente.");

    // Inicialización del reproductor de audio
    const audioPlayer = new Audio('https://shaincast.caster.fm:48858/listen.mp3'); // URL del stream
    audioPlayer.crossOrigin = "anonymous"; // Permite el uso de Web Audio API

    // Configuración de la Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Crear contexto de audio
    const analyser = audioContext.createAnalyser(); // Crear analizador
    const source = audioContext.createMediaElementSource(audioPlayer); // Conectar reproductor al analizador
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Configuración de los vúmetros
    const bars = document.querySelectorAll('.bar'); // Seleccionar las barras
    analyser.fftSize = 256; // Configurar tamaño de análisis
    const bufferLength = analyser.frequencyBinCount; // Número de datos
    const dataArray = new Uint8Array(bufferLength);

    function updateVuMeters() {
        analyser.getByteFrequencyData(dataArray); // Obtener datos del volumen
        bars.forEach((bar, index) => {
            const volume = dataArray[index]; // Volumen capturado
            bar.style.height = `${volume / 2}px`; // Ajustar altura de las barras
        });
        requestAnimationFrame(updateVuMeters); // Animación continua
    }

    // Eventos de reproducción y pausa del reproductor
    audioPlayer.addEventListener('play', () => {
        audioContext.resume(); // Activar el contexto de audio
        updateVuMeters(); // Iniciar los vúmetros
        console.log('Reproducción iniciada');
    });

    audioPlayer.addEventListener('pause', () => {
        audioContext.suspend(); // Detener el contexto de audio
        console.log('Reproducción pausada');
    });

    // Efecto de desvanecimiento del título
    $('#title').hide().fadeIn(2000);

    // Mensaje de bienvenida dinámico
    $('#header-section').append('<p style="font-size: 1.2rem; color: #fff;">Escucha la mejor música cristiana online. ¡Todo el Día...Junto a Vos!</p>');

    // Para probar: Reproducir automáticamente al cargar la página
    audioPlayer.play();
});
