import { useState, useEffect } from "react";
import { toast } from "sonner";

const NCR_CITIES = [
  "Manila",
  "Quezon City", 
  "Makati",
  "Pasig",
  "Taguig",
  "Mandaluyong",
  "Marikina",
  "Pasay",
  "Caloocan",
  "Las Piñas",
  "Muntinlupa",
  "Parañaque",
  "Valenzuela",
  "Malabon",
  "Navotas",
  "San Juan",
  "Pateros"
];

export function WeatherApp() {
  const [selectedCity, setSelectedCity] = useState("Manila");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    const cachedWeather = getCachedWeather(selectedCity);
    if (cachedWeather) {
      setCurrentWeather(cachedWeather);
    } else {
      fetchCurrentWeather();
    }
  }, [selectedCity]);

  const getCachedWeather = (city) => {
    const cacheKey = `weather_${city}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Check if cache is less than 10 minutes old
      if (Date.now() - timestamp < 10 * 60 * 1000) {
        return data;
      }
    }
    return null;
  };

  const setCachedWeather = (city, data) => {
    const cacheKey = `weather_${city}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const fetchCurrentWeather = async () => {
    if (!selectedCity) return;
    
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("Weather API key not configured");
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setCurrentWeather(data);
      setCachedWeather(selectedCity, data);
    } catch (error) {
      toast.error("Failed to fetch weather data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    if (!selectedCity) return;
    
    setForecastLoading(true);
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!apiKey) {
        throw new Error("Weather API key not configured");
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity}&days=5&aqi=yes&alerts=yes`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setForecast(data);
    } catch (error) {
      toast.error("Failed to fetch forecast data");
      console.error(error);
    } finally {
      setForecastLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* City Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select NCR City
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {NCR_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Current Weather */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Current Weather</h2>
          <button
            onClick={fetchCurrentWeather}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : currentWeather ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={`https:${currentWeather.current.condition.icon}`}
                  alt={currentWeather.current.condition.text}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-4xl font-bold text-gray-800">
                    {Math.round(currentWeather.current.temp_c)}°C
                  </div>
                  <div className="text-gray-600">
                    {currentWeather.current.condition.text}
                  </div>
                  <div className="text-sm text-gray-500">
                    Feels like {Math.round(currentWeather.current.feelslike_c)}°C
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="font-medium">{currentWeather.location.name}</div>
                <div>Last updated: {formatTime(currentWeather.location.localtime)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Wind Speed</div>
                <div className="text-xl font-semibold text-blue-600">
                  {currentWeather.current.wind_kph} km/h
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Humidity</div>
                <div className="text-xl font-semibold text-green-600">
                  {currentWeather.current.humidity}%
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">UV Index</div>
                <div className="text-xl font-semibold text-yellow-600">
                  {currentWeather.current.uv}
                </div>
              </div>
              {currentWeather.air_quality && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">PM2.5</div>
                  <div className="text-xl font-semibold text-purple-600">
                    {Math.round(currentWeather.air_quality.pm2_5)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No weather data available
          </div>
        )}
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">5-Day Forecast</h2>
          <button
            onClick={fetchForecast}
            disabled={forecastLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {forecastLoading ? "Loading..." : "Load Forecast"}
          </button>
        </div>

        {forecastLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : forecast ? (
          <div className="space-y-4">
            {/* Weather Alerts */}
            {forecast.alerts?.alert && forecast.alerts.alert.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Weather Alerts</h3>
                {forecast.alerts.alert.map((alert, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <div className="font-medium">{alert.headline}</div>
                    <div className="mt-1">{alert.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Daily Forecast */}
            <div className="grid gap-4">
              {forecast.forecast.forecastday.map((day, index) => (
                <div key={day.date} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        className="w-10 h-10"
                      />
                      <div>
                        <div className="font-medium">
                          {index === 0 ? "Today" : formatDate(day.date)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {day.day.condition.text}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                      </div>
                      <div className="text-sm text-blue-600">
                        {day.day.daily_chance_of_rain}% rain
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sunrise: {day.astro.sunrise}</span>
                    <span>Sunset: {day.astro.sunset}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Click "Load Forecast" to see the 5-day weather forecast
          </div>
        )}
      </div>
    </div>
  );
}