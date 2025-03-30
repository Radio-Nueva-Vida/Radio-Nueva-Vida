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
$(document).ready(function() {
    const barsLeft = $('#vuMeterLeft .bar');
    const barsRight = $('#vuMeterRight .bar');
    let vuMeterInterval;

    // Iniciar animación de las barras
    $('audio').on('play', function() {
        startVuMeters();
    });

    // Detener animación de las barras
    $('audio').on('pause', function() {
        stopVuMeters();
    });

    function startVuMeters() {
        vuMeterInterval = setInterval(() => {
            barsLeft.each(function() {
                const randomHeight = Math.floor(Math.random() * 100); // Altura aleatoria
                $(this).css('height', `${randomHeight}%`);
            });
            barsRight.each(function() {
                const randomHeight = Math.floor(Math.random() * 100); // Altura aleatoria
                $(this).css('height', `${randomHeight}%`);
            });
        }, 200); // Velocidad de cambio
    }

    function stopVuMeters() {
        clearInterval(vuMeterInterval);
        barsLeft.css('height', '10px'); // Reinicia las barras
        barsRight.css('height', '10px');
    }
});
