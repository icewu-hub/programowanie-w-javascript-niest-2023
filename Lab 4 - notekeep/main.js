const notes = [];

const notesDive = document.getElementById("notes");
renderNotes();
function addNote() {
  let title = document.getElementById("title").value;
  let body = document.getElementById("body").value;
  let color = document.getElementById("color").value;
  let type = document.getElementById("type").value;
  let pin = document.getElementById("pin").checked;

  notes.push({
    type: type,
    title: title,
    description: body,
    date: Date.now(),
    color: color,
    id: notes.length + 1,
    pinned: pin,
  });
  console.log(notes);
  clearForm();
  renderNotes();
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
  document.getElementById("color").value = "#000000";
  document.getElementById("type").value = "plain";
  document.getElementById("pin").checked = false;
}

function renderNotes() {
  while (notesDive.firstChild) {
    notesDive.removeChild(notesDive.lastChild);
  }

  notes.forEach((element) => {
    console.log(element);
    const newDiv = document.createElement("div");
    newDiv.id = element.id;
    const newTitle = document.createElement("h1");
    newTitle.innerText = element.title;
    const newDesc = document.createElement("p");
    newDesc.innerText = element.description;
    const newTime = document.createElement("p");
    newTime.innerText = timeStampFormat(element.date);
    newDiv.className = "note";
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newDesc);
    newDiv.appendChild(newTime);
    newDiv.style.backgroundColor = element.color;
    notesDive.appendChild(newDiv);
  });
}

function timeStampFormat(timestamp) {
  let date = new Date(timestamp);
  return (
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    " " +
    date.getDate() +
    "." +
    (date.getMonth() + 1) +
    "." +
    date.getFullYear()
  );
}
