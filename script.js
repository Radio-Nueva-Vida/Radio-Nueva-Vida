const audio = document.getElementById('audio');
const boton = document.getElementById('playPause');
const iconoPlay = document.getElementById('iconoPlay');
const iconoPause = document.getElementById('iconoPause');
const volumen = document.getElementById('volumen');
const streamUrl = 'https://usa13.fastcast4u.com/proxy/nuevavidaonline?mp=/1'; // URL de tu streaming

boton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        iconoPlay.style.display = 'none';
        iconoPause.style.display = 'block';
    } else {
        audio.pause();
        iconoPlay.style.display = 'block';
        iconoPause.style.display = 'none';
    }
});

volumen.addEventListener('input', () => {
    audio.volume = volumen.value;
});

const parser = new ShoutcastMetadataParser(streamUrl);

parser.on('metadata', (metadata) => {
    const artist = metadata.StreamTitle.split(' - ')[0] || 'Artista desconocido';
    const title = metadata.StreamTitle.split(' - ')[1] || 'Título desconocido';

    document.getElementById('artista').textContent = artist.trim();
    document.getElementById('titulo').textContent = title.trim();

    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + title)}&entity=song`)
        .then(response => response.json())
        .then(data => {
            const art = data.results?.[0]?.artworkUrl100 || 'placeholder.png';
            document.getElementById('album-art').src = art.replace('100x100bb.jpg', '300x300bb.jpg');
        })
        .catch(error => console.error('Error obteniendo imagen:', error));
});

parser.connect();