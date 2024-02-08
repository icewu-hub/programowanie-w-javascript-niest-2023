const apiKey = "0c57a2c4aa8fcfcbb10e512138cc49c7";
const rapidApiKey = "641f50a15fmsh262992508576bc9p1de1a1jsn37339ff8f96f";
const notesDive = document.getElementById("notes");
const datalist = document.getElementById("cityData");
const updateInterval = 5 * 60 * 1000;

let notes =
  localStorage.getItem("notes") !== null
    ? JSON.parse(localStorage.getItem("notes"))
    : [];

const clearForm = () => {
  document.getElementById("cityInput").value = "";
};

const updateWeatherData = async () => {
  const promises = notes.map((element, index) =>
    fetchWeatherDataAndUpdate(element, index)
  );
  await Promise.all(promises);
  renderNotes();
};

const fetchWeatherDataAndUpdate = async (element, index) => {
  if (Date.now() > element.lastUpdate + updateInterval) {
    try {
      const weatherData = await getWeatherData(element.data.name);
      const timeUpdate = Date.now();
      notes[index].lastUpdate = timeUpdate;
      notes[index].data = weatherData;
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Error updating weather data:", error);
    }
  }
};

const searchWeatherForACity = async () => {
  let cityName = document.getElementById("cityInput").value;

  try {
    const data = await getWeatherData(cityName);

    if (data.cod == "404") {
      alert("Miasto nie istnieje");
    } else {
      const lastUpdate = Date.now();

      notes.push({
        id: crypto.randomUUID(),
        lastUpdate: lastUpdate,
        data: data,
      });
      localStorage.setItem("notes", JSON.stringify(notes));
      clearForm();
      renderNotes();
    }
  } catch (error) {
    console.error("Error searching for weather:", error);
  }
};

document.getElementById("searchWeather").addEventListener("submit", (event) => {
  event.preventDefault();
  searchWeatherForACity();
});

document.getElementById("cityInput").addEventListener(
  "input",
  debounce(async function () {
    try {
      const cityNames = await getCity(this.value);
      const cities = JSON.parse(cityNames);

      while (datalist.firstChild) {
        datalist.removeChild(datalist.lastChild);
      }

      cities.data.forEach((element) => {
        const newOption = document.createElement("option");
        newOption.value = element.city;
        datalist.appendChild(newOption);
      });
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  }, 1000)
);

async function getWeatherData(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
  try {
    const response = await fetch(weatherURL);
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

async function getCity(city) {
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}&limit=5`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": rapidApiKey,
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();

    return result;
  } catch (error) {
    console.error("Error fetching city:", error);
    throw error;
  }
}

async function getForecastData(cityId) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&APPID=${apiKey}`;
  try {
    const response = await fetch(forecastURL);
    const forecastData = await response.json();
    return forecastData;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
}

async function renderNotes() {
  let data =
    localStorage.getItem("notes") !== null
      ? JSON.parse(localStorage.getItem("notes"))
      : [];

  while (notesDive.firstChild) {
    notesDive.removeChild(notesDive.lastChild);
  }

  //console.log(data);

  for (const element of data) {
    const newDiv = document.createElement("div");
    newDiv.id = element.id;

    const newTitle = document.createElement("h1");
    newTitle.innerText = element.data.name;

    const newIcon = document.createElement("img");
    newIcon.src = `https://openweathermap.org/img/wn/${element.data.weather[0].icon}@2x.png`;
    newIcon.style.height = "50px";
    newIcon.style.width = "50px";

    const newTemp = document.createElement("h1");
    newTemp.innerText = "Temperatura: " + element.data.main.temp + " °C";

    const newWilg = document.createElement("h1");
    newWilg.innerText = "Wilgotność: " + element.data.main.humidity + " %";

    const newUpdae = document.createElement("h1");
    let date = new Date(element.lastUpdate);
    const dateFormat =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    newUpdae.innerText = "Last Update: " + dateFormat;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteNote(element.id));
    newDiv.classList.add("note");

    const chartCanvas = document.createElement("canvas");
    chartCanvas.id = "chart-" + element.id;
    chartCanvas.width = 400;
    chartCanvas.height = 200;

    newDiv.appendChild(newTitle);
    newDiv.appendChild(newIcon);
    newDiv.appendChild(newTemp);
    newDiv.appendChild(newWilg);
    newDiv.appendChild(newUpdae);
    newDiv.appendChild(deleteButton);
    newDiv.appendChild(chartCanvas);

    const forecastData = await getForecastData(element.data.id);
    renderChart(forecastData, chartCanvas);

    notesDive.appendChild(newDiv);
  }
}

async function renderChart(element, container) {
  const forecastData = element;

  if (forecastData && forecastData.list) {
    const temperatureData = forecastData.list.map((hour) => hour.main.temp);
    const timeLabels = forecastData.list.map((hour) => {
      const date = new Date(hour.dt * 1000);
      return (
        date.getDate() +
        "." +
        String(date.getMonth() + 1).padStart(2, "0") +
        "  " +
        String(date.getHours()).padStart(2, "0") +
        ":" +
        String(date.getMinutes()).padStart(2, "0")
      );
    });

    const ctx = container.getContext("2d");

    if (container.chart) {
      container.chart.destroy();
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: timeLabels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatureData,
            borderColor: "rgba(75, 192, 192, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            type: "linear",
            position: "left",
          },
        },
      },
    });
  } else {
    console.error("Error rendering chart: Missing or invalid data structure");
  }
}

function deleteNote(noteId) {
  notes = notes.filter((note) => note.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const initialize = async () => {
  if (notes) {
    const promises = notes.map((element, index) =>
      fetchWeatherDataAndUpdate(element, index)
    );

    Promise.all(promises).then(() => renderNotes());
    setInterval(() => {
      updateWeatherData();
    }, updateInterval);
  }
};

initialize();
