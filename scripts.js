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

