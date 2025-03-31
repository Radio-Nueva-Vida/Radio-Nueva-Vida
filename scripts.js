$(document).ready(function () {
    console.log("Página de Radio Nueva Vida cargada correctamente.");

    // Inicialización del reproductor de audio
    const audioPlayer = new Audio('http://shaincast.caster.fm:48858/listen.mp3'); // URL del stream
    audioPlayer.crossOrigin = "anonymous"; // Permite el uso de Web Audio API

    audioPlayer.addEventListener('pause', () => {
        audioContext.suspend(); // Detener el contexto de audio
        console.log('Reproducción pausada');
    });

    // Efecto de desvanecimiento del título
    $('#title').hide().fadeIn(2000);

    // Mensaje de bienvenida dinámico
    $('#header-section').append('<p style="font-size: 1.2rem; color: #fff;">Escucha la mejor música cristiana online. ¡Todo el Día...Junto a Vos!</p>');

$(document).ready(function () {
    console.log("Animación visual para los vúmetros activa.");

    const barsLeft = $('#vuMeterLeft .bar');
    const barsRight = $('#vuMeterRight .bar');

    function animateBars() {
        // Iterar sobre las barras y asignar alturas aleatorias
        barsLeft.each(function () {
            const randomHeight = Math.random() * 50 + 10; // Altura entre 10px y 60px
            $(this).css('height', `${randomHeight}px`);
        });
        barsRight.each(function () {
            const randomHeight = Math.random() * 50 + 10;
            $(this).css('height', `${randomHeight}px`);
        });
    }

    // Ejecutar la animación cada 200ms
    setInterval(animateBars, 200);
});
