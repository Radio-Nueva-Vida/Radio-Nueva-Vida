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
    const vuMeterLeft = $('#vuMeterLeft');
    const vuMeterRight = $('#vuMeterRight');

    $('audio').on('play', function() {
        startVuMeters(); // Inicia la animación
    });

    $('audio').on('pause', function() {
        stopVuMeters(); // Detén la animación
    });

    let vuMeterInterval;

    function startVuMeters() {
        vuMeterInterval = setInterval(() => {
            const randomHeightLeft = Math.random() * 100; // Altura aleatoria
            const randomHeightRight = Math.random() * 100;
            vuMeterLeft.css('height', `${randomHeightLeft}%`);
            vuMeterRight.css('height', `${randomHeightRight}%`);
        }, 100); // Ajusta la velocidad de la animación
    }

    function stopVuMeters() {
        clearInterval(vuMeterInterval);
        vuMeterLeft.css('height', '0%'); // Reinicia al detener
        vuMeterRight.css('height', '0%');
    }
});
