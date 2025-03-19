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
