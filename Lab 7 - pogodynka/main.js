let notes =
  localStorage.getItem("notes") !== null
    ? JSON.parse(localStorage.getItem("notes"))
    : [];

const notesDive = document.getElementById("notes");
renderNotes();

document
  .getElementById("searchWeather")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    searchWeatherForACity();
  });

function searchWeatherForACity() {
  let cityName = document.getElementById("cityInput").value;

  // TODO: Fetch from API

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
  document.getElementById("cityInput").value = "";
}

// function renderNotes(temp) {
//   while (notesDive.firstChild) {
//     notesDive.removeChild(notesDive.lastChild);
//   }
//   tempNotes = temp !== undefined ? temp : notes;
//   tempNotes.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

//   tempNotes.forEach((element) => {
//     const newDiv = document.createElement("div");
//     newDiv.id = element.id;
//     const newTitle = document.createElement("h1");
//     newTitle.innerText = element.title;
//     const newDesc = document.createElement("p");
//     newDesc.innerText = element.description;
//     const newTags = document.createElement("p");
//     newTags.innerText = element.tags.join(", ");
//     const newTime = document.createElement("p");
//     const pinButton = document.createElement("button");
//     pinButton.className = "pin-button";
//     pinButton.innerText = element.pinned ? "Unpin" : "Pin";
//     if (element.pinned) {
//       newDiv.classList.add("pinned");
//     } else {
//       newDiv.classList.remove("pinned");
//     }

//     pinButton.addEventListener("click", () => togglePin(element.id));
//     const deleteButton = document.createElement("button");
//     deleteButton.innerText = "Delete";
//     deleteButton.className = "delete-button";
//     deleteButton.addEventListener("click", () => deleteNote(element.id));
//     newTime.innerText = timeStampFormat(element.date);
//     newDiv.classList.add("note");
//     const textColor = getTextColor(element.color);

//     newDiv.style.color = textColor;
//     newDiv.appendChild(newTitle);
//     newDiv.appendChild(newDesc);
//     newDiv.appendChild(newTags);
//     newDiv.appendChild(newTime);

//     newDiv.appendChild(pinButton);
//     newDiv.appendChild(deleteButton);
//     newDiv.style.backgroundColor = element.color;
//     notesDive.appendChild(newDiv);
//   });
// }

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
