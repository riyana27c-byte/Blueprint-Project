import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=40.4862&longitude=-74.4518&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
    )
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

  return (
    <div>
      <h1>Weather App</h1>
      {weather ? (
        <div className="weather-card">
          <div className="weather-details">
            <h2>Current Weather</h2>
            <div className="weather-meta">
              <span className="weather-value">{weather.current.temperature_2m}°F</span> Temperature
            </div>
            <div className="weather-meta">
              <span className="weather-value">{weather.current.apparent_temperature}°F</span> Feels Like
            </div>
            <div className="weather-meta">
              <span className="weather-value">{weather.current.relative_humidity_2m}%</span> Humidity
            </div>
            <div className="weather-meta">
              <span className="weather-value">{weather.current.precipcipitation}</span> Precipitation
            </div>
          </div>
          <div className="weather-summary">
            <div className="big">{weather.current.temperature_2m}°F</div>
            <div className="small">Current Temp</div>
          </div>
        </div>
      ) : (
        <div className="loading">
          <div className="spinner"></div>
          Loading weather data...
        </div>
      )}
      <footer>Weather data provided by Open-Meteo</footer>
    </div>
  );
}

export default App;