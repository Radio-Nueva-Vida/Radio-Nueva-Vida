window.onload = () => {
  const audio = document.getElementById('audio');
  const ctxL = document.getElementById('vuLeft').getContext('2d');
  const ctxR = document.getElementById('vuRight').getContext('2d');

  function drawVU(ctx, value) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "red";
    ctx.fillRect(0, height - value * height, width, value * height);
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
      drawVU(ctxL, left / 255);
      drawVU(ctxR, right / 255);
    }

    animate();
  };
};
