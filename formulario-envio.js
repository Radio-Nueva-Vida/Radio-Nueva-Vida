// ===== ENVÍO DEL FORMULARIO AL BUZÓN =====
// Pegá esto en la web de la radio y llamá a enviarPedido() al presionar "Enviar Pedido".
//
// En el HTML del formulario agregá un campo trampa que los humanos no ven:
//   <input type="text" id="web_extra" tabindex="-1" autocomplete="off"
//          style="position:absolute;left:-9999px" aria-hidden="true">

const URL_BUZON = 'PEGA-AQUI-LA-URL-DE-LA-APLICACION-WEB-QUE-TERMINA-EN-/exec';

async function enviarPedido() {
  const datos = {
    nombre: document.getElementById('nombre').value,
    cancion: document.getElementById('cancion').value,
    ubicacion: document.getElementById('ubicacion').value,
    mensaje: document.getElementById('mensaje').value,
    web_extra: document.getElementById('web_extra').value, // debe ir vacío
  };

  if (!datos.nombre.trim() || !datos.cancion.trim()) {
    alert('Completá tu nombre y la canción que querés escuchar.');
    return false;
  }

  try {
    // Content-Type text/plain evita la verificación previa (CORS preflight),
    // que Google Apps Script no soporta.
    const r = await fetch(URL_BUZON, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(datos),
    });
    const res = await r.json();
    if (res.ok) {
      alert('¡Pedido enviado! Gracias por escucharnos.');
      return true;
    }
    alert('No pudimos enviar tu pedido. Probá de nuevo.');
  } catch (e) {
    alert('Sin conexión. Probá de nuevo en un momento.');
  }
  return false;
}
