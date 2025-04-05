const canvasLeft = document.getElementById("vuLeft");
const canvasRight = document.getElementById("vuRight");
const ctxL = canvasLeft.getContext("2d");
const ctxR = canvasRight.getContext("2d");
const audio = document.getElementById("audio");

let context, analyser, source, dataArray;

function drawNeedle(ctx, value) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  ctx.arc(width / 2, height, height, Math.PI, 2 * Math.PI);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  let angle = Math.PI + (value * Math.PI);
  let x = width / 2 + height * Math.cos(angle);
  let y = height - height * Math.sin(angle);

  ctx.beginPath();
  ctx.moveTo(width / 2, height);
  ctx.lineTo(x, y);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function update() {
  requestAnimationFrame(update);
  analyser.getByteFrequencyData(dataArray);
  let left = dataArray[0] / 255;
  let right = dataArray[1] / 255;
  drawNeedle(ctxL, left);
  drawNeedle(ctxR, right);
}

audio.onplay = () => {
  if (!context) {
    context = new AudioContext();
    analyser = context.createAnalyser();
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    update();
  }
};
