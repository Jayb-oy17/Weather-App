
const apiKey = "e265b66c85c4292004b19a4ed5b60c30"; // Replace with your working API key later!

const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const descElement = document.querySelector(".description");
const iconElement = document.querySelector(".weather-icon");
const loadingElement = document.getElementById("loading");

const searchBtn = document.getElementById("searchBtn");
const gpsBtn = document.getElementById("gpsBtn");
const cityInput = document.getElementById("cityInput");

function setBackground(condition) {
  if (condition.includes("cloud")) {
    document.body.style.background =
      "linear-gradient(to right, #bdc3c7, #2c3e50)";
  } else if (condition.includes("rain")) {
    document.body.style.background =
      "linear-gradient(to right, #4b79a1, #283e51)";
  } else if (condition.includes("sun") || condition.includes("clear")) {
    document.body.style.background =
      "linear-gradient(to right, #fbd3e9, #bb377d)";
  } else {
    document.body.style.background =
      "linear-gradient(to right, #74ebd5, #ACB6E5)";
  }
}

function showLoading(show) {
  if (show) {
    loadingElement.classList.remove("hidden");
  } else {
    loadingElement.classList.add("hidden");
  }
}

function updateWeather(data) {
  cityElement.textContent = data.name;
  tempElement.textContent = `${Math.round(data.main.temp)}°C`;
  descElement.textContent = data.weather[0].description;
  iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  iconElement.alt = data.weather[0].description;

  setBackground(data.weather[0].description.toLowerCase());
}

function fetchWeather(city) {
  showLoading(true);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      updateWeather(data);
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      showLoading(false);
    });
}

function fetchWeatherByLocation(lat, lon) {
  showLoading(true);
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      updateWeather(data);
    })
    .catch((error) => {
      alert("Failed to get weather by location");
    })
    .finally(() => {
      showLoading(false);
    });
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

gpsBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      () => {
        alert("Failed to get your location");
      }
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

// Optional: Enter key press to search
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
