let notes =
  localStorage.getItem("notes") !== null
    ? JSON.parse(localStorage.getItem("notes"))
    : [];

const notesDive = document.getElementById("notes");
const datalist = document.getElementById("cityData");
renderNotes();

document
  .getElementById("searchWeather")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    searchWeatherForACity();
  });

document
  .getElementById("cityInput")
  .addEventListener("input", function (event) {
    while (datalist.firstChild) {
      datalist.removeChild(datalist.lastChild);
    }
    console.log(this.value);
    getCity(this.value)
      .then((data) => {
        console.log(data);
        let cities = JSON.parse(data);
        console.log(cities);
        cities.data.forEach((element) => {
          const newOption = document.createElement("option");
          newOption.value = element.city;
          datalist.appendChild(newOption);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  });

function searchWeatherForACity() {
  let cityName = document.getElementById("cityInput").value;

  // TODO: Fetch from API
  getWeatherData(cityName)
    .then((data) => {
      console.log({
        id: crypto.randomUUID(),
        lastUpdate: Date.now(),
        data: data,
      });
      notes.push({
        id: crypto.randomUUID(),
        lastUpdate: Date.now(),
        data: data,
      });
      localStorage.setItem("notes", JSON.stringify(notes));
      clearForm();
      renderNotes();
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(notes);
}

function clearForm() {
  document.getElementById("cityInput").value = "";
}
async function getWeatherData(city) {
  const apiKey = "0c57a2c4aa8fcfcbb10e512138cc49c7";
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
  try {
    const response = await fetch(weatherURL);
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.log("Error fetching weather data:", error);
    throw error;
  }
}
async function getCity(city) {
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}&limit=5`;
  console.log(url);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "641f50a15fmsh262992508576bc9p1de1a1jsn37339ff8f96f",
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();

    return result;
  } catch (error) {
    console.error(error);
  }
}

function renderNotes(temp) {
  console.log(notes);
  while (notesDive.firstChild) {
    notesDive.removeChild(notesDive.lastChild);
  }
  tempNotes = temp !== undefined ? temp : notes;
  tempNotes.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  tempNotes.forEach((element) => {
    const newDiv = document.createElement("div");
    newDiv.id = element.id;
    const newTitle = document.createElement("h1");
    newTitle.innerText = element.data.name;
    const newTemp = document.createElement("h1");
    newTemp.innerText = element.data.main.temp + " °C";
    //const pinButton = document.createElement("button");
    // pinButton.className = "pin-button";
    // pinButton.innerText = element.pinned ? "Unpin" : "Pin";
    // if (element.pinned) {
    //   newDiv.classList.add("pinned");
    // } else {
    //   newDiv.classList.remove("pinned");
    // }
    //pinButton.addEventListener("click", () => togglePin(element.id));

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteNote(element.data.id));
    newDiv.classList.add("note");

    newDiv.appendChild(newTitle);
    newDiv.appendChild(newTemp);
    newDiv.appendChild(deleteButton);
    notesDive.appendChild(newDiv);
  });
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
