let notes =
  localStorage.getItem("notes") !== null
    ? JSON.parse(localStorage.getItem("notes"))
    : [];

const notesDive = document.getElementById("notes");
renderNotes();

document.getElementById("addForm").addEventListener("submit", function (event) {
  event.preventDefault();
  addNote();
});

function addNote() {
  let title = document.getElementById("title").value;
  let body = document.getElementById("body").value;
  let color = document.getElementById("color").value;
  let type = document.getElementById("type").value;
  let pin = document.getElementById("pin").checked;
  let tags = document.getElementById("tags").value
    ? document
        .getElementById("tags")
        .value.split(",")
        .map((item) => item.trim())
    : [];

  notes.push({
    type: type,
    title: title,
    description: body,
    date: Date.now(),
    color: color,
    id: Date.now().toString(),
    pinned: pin,
    tags: tags,
  });

  localStorage.setItem("notes", JSON.stringify(notes));
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

function renderNotes(temp) {
  while (notesDive.firstChild) {
    notesDive.removeChild(notesDive.lastChild);
  }
  tempNotes = temp !== undefined ? temp : notes;
  tempNotes.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  tempNotes.forEach((element) => {
    const newDiv = document.createElement("div");
    newDiv.id = element.id;
    const newTitle = document.createElement("h1");
    newTitle.innerText = element.title;
    const newDesc = document.createElement("p");
    newDesc.innerText = element.description;
    const newTags = document.createElement("p");
    newTags.innerText = element.tags.join(", ");
    const newTime = document.createElement("p");
    const pinButton = document.createElement("button");
    pinButton.className = "pin-button";
    pinButton.innerText = element.pinned ? "Unpin" : "Pin";
    if (element.pinned) {
      newDiv.classList.add("pinned");
    } else {
      newDiv.classList.remove("pinned");
    }

    pinButton.addEventListener("click", () => togglePin(element.id));
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteNote(element.id));
    newTime.innerText = timeStampFormat(element.date);
    newDiv.classList.add("note");
    const textColor = getTextColor(element.color);

    newDiv.style.color = textColor;
    newDiv.appendChild(newTitle);
    newDiv.appendChild(newDesc);
    newDiv.appendChild(newTags);
    newDiv.appendChild(newTime);

    newDiv.appendChild(pinButton);
    newDiv.appendChild(deleteButton);
    newDiv.style.backgroundColor = element.color;
    notesDive.appendChild(newDiv);
  });
}

function getTextColor(backgroundColor) {
  // Convert the background color to RGB
  const rgb = parseInt(backgroundColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000" : "#fff";
}

function togglePin(noteId) {
  const noteIndex = notes.findIndex((note) => note.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex].pinned = !notes[noteIndex].pinned;
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
}

function deleteNote(noteId) {
  notes = notes.filter((note) => note.id !== noteId);

  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
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

document.getElementById("search").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();

  const filteredNotes = notes.filter((note) => {
    const titleMatch = note.title.toLowerCase().includes(searchTerm);
    const bodyMatch = note.description.toLowerCase().includes(searchTerm);
    const tagsMatch =
      note.tags &&
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

    return titleMatch || bodyMatch || tagsMatch;
  });

  renderNotes(filteredNotes);
});
