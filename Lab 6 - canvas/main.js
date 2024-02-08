const ballsCountInput = document.getElementById("ballsCount");
const maxDistanceInput = document.getElementById("maxDistance");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

let ballsArray = [];
const canvasBody = document.getElementById("canvasBody");
const canvas = canvasBody.getContext("2d");

startButton.addEventListener("click", () => {
  if (isInputInvalid()) {
    alert("You need to fill both fields");
  } else {
    if (ballsArray.length === 0) {
      generateBalls(Number(ballsCountInput.value));
    }
    animate();
  }
});

function isInputInvalid() {
  return ballsCountInput.value === "" || maxDistanceInput.value === "";
}

function generateBalls(count) {
  for (let i = 0; i < count; i++) {
    const radius = randomNumber(10, 20);
    ballsArray.push(
      new Ball(
        randomNumber(radius, canvasBody.width - radius),
        randomNumber(radius, canvasBody.height - radius),
        radius
      )
    );
  }
}

function animate() {
  startButton.disabled = true;
  canvas.clearRect(0, 0, canvasBody.width, canvasBody.height);

  ballsArray.forEach((ball, i) => {
    for (let j = i + 1; j < ballsArray.length; j++) {
      if (distance(ball, ballsArray[j]) < Number(maxDistanceInput.value)) {
        connect(ball, ballsArray[j]);
      }
    }

    ball.move();
    ball.draw();
  });

  requestAnimationFrame(animate);

  if (ballsArray.length === 0) {
    cancelAnimationFrame(animate);
    startButton.disabled = false;
  }
}

resetButton.addEventListener("click", () => {
  cancelAnimationFrame(animate);
  clearCanvas();
  ballsArray = [];
  ballsCountInput.value = "";
  maxDistanceInput.value = "";
  startButton.disabled = false;
});

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = getRandomColor();
    this.vx = getRandomVelocity();
    this.vy = getRandomVelocity();
  }

  draw() {
    canvas.fillStyle = this.color;
    canvas.beginPath();
    canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    canvas.fill();
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.radius > canvasBody.width || this.x - this.radius < 0) {
      this.vx = -this.vx;
    }

    if (this.y + this.radius > canvasBody.height || this.y - this.radius < 0) {
      this.vy = -this.vy;
    }
  }
}

function connect(b1, b2) {
  canvas.beginPath();
  canvas.strokeStyle = "#000";
  canvas.moveTo(b1.x, b1.y);
  canvas.lineTo(b2.x, b2.y);
  canvas.stroke();
}

function distance(b1, b2) {
  const xDist = b1.x - b2.x;
  const yDist = b1.y - b2.y;
  return Math.sqrt(xDist ** 2 + yDist ** 2);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function getRandomVelocity() {
  return Math.random() * 3 - 1.5;
}

function clearCanvas() {
  canvas.clearRect(0, 0, canvasBody.width, canvasBody.height);
}
