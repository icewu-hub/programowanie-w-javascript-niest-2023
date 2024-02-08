const allSounds = document.querySelectorAll("audio");
const soundMenu = document.getElementById("soundBoardMenu");
const metronomBtn = document.getElementById("metronomBtn");
const metronomInput = document.getElementById("metronom");
const recordBtns = document.querySelectorAll(".record");
const playBtns = document.querySelectorAll(".play");
const playAll = document.querySelector("#playAll");

document.addEventListener("keypress", onKeyPress);

let metronom = false;
const metronomSound = "a";
let speedMetronom = 60;
let interval;

const tracks = [
  { startTime: 0, timeStamp: [], sound: [] },
  { startTime: 0, timeStamp: [], sound: [] },
  { startTime: 0, timeStamp: [], sound: [] },
  { startTime: 0, timeStamp: [], sound: [] },
];

const KeyToSound = {
  a: document.querySelector("#s1"),
  s: document.querySelector("#s2"),
  d: document.querySelector("#s3"),
  f: document.querySelector("#s4"),
  g: document.querySelector("#s5"),
  h: document.querySelector("#s6"),
  j: document.querySelector("#s7"),
  k: document.querySelector("#s8"),
  l: document.querySelector("#s9"),
};

Object.keys(KeyToSound).forEach((key) => {
  const value = KeyToSound[key];
  let src = value.src.split("/");
  const newH = document.createElement("h1");
  newH.innerText = `${key.toUpperCase()} - ${
    src[src.length - 1].split(".")[0]
  }`;
  soundMenu.appendChild(newH);
});

function onKeyPress(event) {
  const sound = KeyToSound[event.key];
  playSound(sound);
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function startStopMetronome(speed) {
  if (metronom) {
    clearInterval(interval);
    metronom = false;
  } else {
    metronom = true;

    interval = setInterval(() => {
      playSound(KeyToSound[metronomSound]);
    }, 60000 / speed);
  }
}
metronomBtn.addEventListener("click", () => startStopMetronome(speedMetronom));
metronomInput.addEventListener(
  "input",
  () => (speedMetronom = metronomInput.value)
);

function stopAllRecordings() {
  for (let i = 0; i < tracks.length; i++) {
    document.removeEventListener("keypress", (e) => {});
  }
}

function record(track) {
  stopAllRecordings();
  track["sound"] = [];
  track["timeStamp"] = [];
  track["startTime"] = Date.now();
  document.addEventListener("keypress", (e) => listen(track, e));
}

function listen(track, key) {
  track["sound"].push(key.key);
  track["timeStamp"].push(Date.now());
}

function playRecording(track) {
  console.log(tracks);
  for (let x = 0; x < track["sound"].length; x++) {
    setTimeout(() => {
      playSound(KeyToSound[track["sound"][x]]);
    }, track["timeStamp"][x] - track["startTime"]);
  }
}

console.log(recordBtns);
recordBtns.forEach((element, index) => {
  element.addEventListener("click", () => record(tracks[index]));
});
playBtns.forEach((element, index) => {
  element.addEventListener("click", () => playRecording(tracks[index]));
});

playAll.addEventListener("click", () =>
  tracks.forEach((track) => playRecording(track))
);
