import { useState } from 'react'
import WeatherCard from './WeatherCard';
import './App.css';

interface GeoResult{
  latitude: number;
  longitude: number;
  name: string;
}

interface GeoResponse {
  results: GeoResult[];
}

interface WeatherResponse {
  current: {
    temperature_2m: number;
  };
}

function App() {
const [city, setCity] = useState('');
const [cityName, setCityName] = useState('');
const [temperature, setTemperature] = useState<number | null>(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const searchWeather = async () => {
  if (!city.trim()) {
    setError("Please enter a city name.");
    return;
  }
  try {
    setLoading(true);
    setError("");
    const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
  );

  const geoData: GeoResponse = await geoResponse.json();
  if (!geoData.results){
    setError("City not found.");
    setLoading(false);
    return;
  }
  const latitude = geoData.results[0].latitude;
  const longitude = geoData.results[0].longitude;

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
  );

  const weatherData: WeatherResponse = await weatherResponse.json();

  setTemperature(weatherData.current.temperature_2m );
  setCityName(geoData.results[0].name);
}
  catch (error) {
    setError("An error occurred while fetching the weather data.");
    setTemperature(null);
    setCityName('');
  } finally {
    setLoading(false);
  }
  
};

  return (
    <div className="app">
      <div className="container">
      <h1>Weather App</h1>

      <div className="search">
      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" onKeyDown={(e) =>{ if (e.key === 'Enter') { searchWeather(); } }} />
      <button onClick={searchWeather} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {temperature !== null &&
       <WeatherCard city={cityName} temperature={temperature} />}
       </div>
    </div>
      
  )
}

export default App
