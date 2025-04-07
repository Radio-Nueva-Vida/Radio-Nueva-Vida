
window.onload = () => {
  const audio = document.getElementById('audio');
  const canvases = document.querySelectorAll('.vu-meter canvas');

  function drawNeedle(ctx, value) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height * 0.9;
    const radius = ctx.canvas.width * 0.4;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const angle = (value * 1.5 - 0.75) * Math.PI; // de -135 a +135 grados

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY - radius * Math.sin(angle));
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }

  let context, analyser, source, dataArray;

  audio.onplay = () => {
    if (!context) {
      context = new AudioContext();
      analyser = context.createAnalyser();
      source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    function animate() {
      requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);
      let left = dataArray.slice(0, dataArray.length / 2).reduce((a, b) => a + b) / (dataArray.length / 2);
      let right = dataArray.slice(dataArray.length / 2).reduce((a, b) => a + b) / (dataArray.length / 2);
      drawNeedle(canvases[0].getContext('2d'), left / 255);
      drawNeedle(canvases[1].getContext('2d'), right / 255);
    }

    animate();
  };
};
