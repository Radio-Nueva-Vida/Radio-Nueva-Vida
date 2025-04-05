
const audio = document.getElementById('audio');
const ctxL = document.getElementById('vuLeft').getContext('2d');
const ctxR = document.getElementById('vuRight').getContext('2d');

function drawVU(ctx, value) {
  ctx.clearRect(0, 0, 120, 60);
  ctx.beginPath();
  ctx.arc(60, 60, 60, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  const angle = Math.PI + value * Math.PI;
  ctx.moveTo(60, 60);
  ctx.lineTo(60 + 50 * Math.cos(angle), 60 + 50 * Math.sin(angle));
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
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
    drawVU(ctxL, left / 255);
    drawVU(ctxR, right / 255);
  }
  animate();
};
