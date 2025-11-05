const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const colorBtn = document.getElementById("colorBtn");
const eraserBtn = document.getElementById("eraserBtn");
const sizeRange = document.getElementById("sizeRange");
const clearBtn = document.getElementById("clearBtn");

canvas.width = 800;
canvas.height = 500;

let drawing = false;
let color = "#000";
let lineWidth = 2;
let erasing = false;

colorBtn.addEventListener("click", () => {
  const newColor = prompt("Enter color (e.g., red, #00ff00):", color);
  if (newColor) {
    color = newColor;
    erasing = false;
  }
});

eraserBtn.addEventListener("click", () => {
  erasing = true;
});

sizeRange.addEventListener("input", (e) => {
  lineWidth = e.target.value;
});


canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  const { offsetX, offsetY } = e;
  socket.emit("draw", { type: "start", x: offsetX, y: offsetY });
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  socket.emit("draw", { type: "stop" });
  ctx.beginPath();
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const { offsetX, offsetY } = e;

  const strokeColor = erasing ? "#fff" : color;

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = strokeColor;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);

  socket.emit("draw", {
    type: "draw",
    x: offsetX,
    y: offsetY,
    color: strokeColor,
    lineWidth,
  });
});

socket.on("draw", (data) => {
  switch (data.type) {
    case "start":
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      break;
    case "draw":
      ctx.lineWidth = data.lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = data.color;
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
      break;
    case "stop":
      ctx.beginPath();
      break;
  }
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit("clear");
});

socket.on("clear", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
