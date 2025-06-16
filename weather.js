const apiKey = "8fa6861c182d5e7aa3319847acf4b698";
const city = "Hyderabad";

async function fetchWeather() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const data = await response.json();

    const weatherData = data.weather[0].main;
    const weatherDescription = data.weather[0].description;
    const weatherIcon = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const windDirection = data.wind.deg;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    document.getElementById("weatherData").textContent = weatherData;
    document.getElementById("weatherDescription").textContent = weatherDescription;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${weatherIcon}@4x.png`;
    document.getElementById("temperature").textContent = Math.round(temperature);
    document.getElementById("city").textContent = city;

    const lat = data.coord.lat;
    const lon = data.coord.lon;

    updateHumidity(humidity);
    updateWindInfo(windSpeed, windDirection);
    fetchAirQuality(lat, lon);
  } catch (error) {
    console.error("Error fetching weather: ", error);
  }
}

async function fetchForecast() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );

    const data = await response.json();

    const forecastList = data.list;
    const dailyForecasts = {};
    const cards = document.querySelectorAll(".forecast-card");

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });

      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          day: day,
          icon: forecast.weather[0].icon,
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
        };
      }
    });

    const forecasts = Object.values(dailyForecasts);
    forecasts.forEach((forecast, i) => {
      if (cards[i]) {
        cards[i].querySelector(".forecast-day").textContent = forecast.day;
        cards[i].querySelector(".forecast-icon").src = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
        cards[i].querySelector(".forecast-temp-min").textContent = Math.round(forecast.temp_min);
        cards[i].querySelector(".forecast-temp-max").textContent = Math.round(forecast.temp_max);
      }
    });
  } catch (error) {
    console.error("Error fetching forecast: ", error);
  }
}

function updateHumidity(humidity) {
  document.getElementById("humidity-value").textContent = `${humidity}`;
  document.getElementById("humidity-bar").style.width = `${humidity}%`;

  let color, text;
  if (humidity < 30) {
    color = "bg-yellow-500";
    text = "Low";
  } else if (humidity < 65) {
    color = "bg-green-400";
    text = "Comfortable";
  } else {
    color = "bg-blue-500";
    text = "High";
  }

  document.getElementById("humidity-bar").className =
    `${color} h-2.5 rounded-full transition-all duration-300 mt-3`;
  document.getElementById("humidity-text").textContent = text;
}

function updateWindInfo(speed, degree) {
  const speedKmh = Math.round(speed * 3.6);
  document.getElementById("wind-speed").textContent = speedKmh;

  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  const index = Math.round(degree / 22.5) % 16;
  document.getElementById("wind-direction").textContent = directions[index];

  document.getElementById("wind-arrow").style.transform = `rotate(${degree}deg)`;
  document.getElementById("wind-arrow").style.transition = "transform 0.3s";
}

async function fetchAirQuality(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const data = await response.json();

    const aqi = data.list[0].main.aqi;
    let aqiText = "";
    let aqiColor = "";
    let aqiWidth = "";

    switch (aqi) {
      case 1:
        aqiText = "Good";
        aqiColor = "bg-green-400";
        aqiWidth = "20%";
        break;
      case 2:
        aqiText = "Fair";
        aqiColor = "bg-yellow-300";
        aqiWidth = "40%";
        break;
      case 3:
        aqiText = "Moderate";
        aqiColor = "bg-orange-400";
        aqiWidth = "60%";
        break;
      case 4:
        aqiText = "Poor";
        aqiColor = "bg-red-500";
        aqiWidth = "80%";
        break;
      case 5:
        aqiText = "Very Poor";
        aqiColor = "bg-purple-700";
        aqiWidth = "100%";
        break;
      default:
        aqiText = "Good";
        aqiColor = "bg-green-400";
        aqiWidth = "0%";
        break;
    }

    document.getElementById("aqi-value").textContent = aqi;
    document.getElementById("aqi-text").textContent = aqiText;
    document.getElementById("aqi-bar").className =
      `${aqiColor} h-2.5 rounded-full transition-all duration-300 mt-3`;
    document.getElementById("aqi-bar").style.width = aqiWidth;
  } catch (error) {
    console.error("Error fetching air quality:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchWeather();
  fetchForecast();
});