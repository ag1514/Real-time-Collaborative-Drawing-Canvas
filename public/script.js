const socket = io();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

const colorBtn = document.getElementById("colorBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const sizeRange = document.getElementById("sizeRange");
const sizeLabel = document.querySelector('label[for="sizeRange"]');

const colorPicker = document.createElement("input");
colorPicker.type = "color";
colorPicker.style.display = "none";
document.body.appendChild(colorPicker);

let drawing = false;
let color = "#000";
let isEraser = false;
let brushSize = sizeRange.value;


colorBtn.addEventListener("click", () => colorPicker.click());
colorPicker.addEventListener("input", (e) => {
  color = e.target.value;
  isEraser = false;
  eraserBtn.classList.remove("active");
  sizeLabel.textContent = "🖌️ Brush Size:";
});

eraserBtn.addEventListener("click", () => {
  isEraser = !isEraser;
  eraserBtn.classList.toggle("active");
  sizeLabel.textContent = isEraser ? "🩹 Eraser Size:" : "🖌️ Brush Size:";
});

sizeRange.addEventListener("input", (e) => {
  brushSize = e.target.value;
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit("clear");
});

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);


function draw(e) {
  if (!drawing) return;
  const x = e.offsetX;
  const y = e.offsetY;

  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = isEraser ? "#fff" : color;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  socket.emit("draw", { x, y, color: ctx.strokeStyle, brushSize });
}


socket.on("draw", (data) => {
  ctx.lineWidth = data.brushSize;
  ctx.strokeStyle = data.color;
  ctx.lineCap = "round";

  ctx.lineTo(data.x, data.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
});

socket.on("clear", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
