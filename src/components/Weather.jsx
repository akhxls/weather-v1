import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null); // Set to `null` initially
  const [error, setError] = useState(null); // State to handle errors

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    setError(null); // Reset error state
    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      if (!apiKey) {
        throw new Error("API key is missing. Please configure it in your .env file.");
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const icon = allIcons[data.weather[0]?.icon] || clear_icon;
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
      } else {
        throw new Error(data.message || "Failed to fetch weather data.");
      }
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className="weather">
      <div className="searchbar">
        <input ref={inputRef} type="text" placeholder="Search any city" />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {weatherData ? (
        <>
          <img src={weatherData.icon} className="weather_icon" alt="Weather Icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weatherdata">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        !error && <p>Loading...</p> // Display loading text if no error and no data yet
      )}
    </div>
  );
};

export default Weather;
