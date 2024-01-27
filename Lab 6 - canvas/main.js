const ballsCount = document.getElementById("ballsCount");
const maxDistance = document.getElementById("maxDistance");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

let ballsArray = [];

const canvasBody = document.getElementById("canvasBody");
let canvas = canvasBody.getContext("2d");

startButton.addEventListener("click", function (e) {
  if (ballsCount.value == "" || maxDistance.value == "") {
    alert("You need to fill both fields");
  } else {
    // TODO: Draw balls on canva
  }
});

resetButton.addEventListener("click", function (e) {
  canvas.clearRect(0, 0, canvasBody.width, canvasBody.height);
  balls = [];
});
