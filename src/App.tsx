import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { WeatherService } from './services/weatherService';
import { WeatherData } from './types/weather';
import { getWeatherCondition } from './utils/weatherUtils';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherForecast } from './components/WeatherForecast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WeatherInsight } from './components/WeatherInsight';
import { WeatherFun } from './components/WeatherFun';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('Current Location');
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [backgroundClass, setBackgroundClass] = useState('from-blue-400 via-purple-400 to-orange-300');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const fetchWeatherData = async (latitude: number, longitude: number, locationName?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const weatherData = await WeatherService.getCurrentWeather(latitude, longitude, temperatureUnit);
      setWeather(weatherData);
      
      if (locationName) {
        setLocationName(locationName);
      }
      
      // Update background based on weather condition
      const condition = getWeatherCondition(weatherData.current.weather_code, weatherData.current.is_day);
      setBackgroundClass(condition.background);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const position = await WeatherService.getCurrentPosition();
      await fetchWeatherData(position.latitude, position.longitude, 'Current Location');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSelect = async (latitude: number, longitude: number, locationName: string) => {
    await fetchWeatherData(latitude, longitude, locationName);
  };

  const handleRefresh = () => {
    if (weather) {
      fetchWeatherData(weather.latitude, weather.longitude, locationName);
    }
  };

  const handleToggleUnit = async () => {
    const newUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTemperatureUnit(newUnit);
    
    if (weather) {
      try {
        setLoading(true);
        setError(null);
        
        const weatherData = await WeatherService.getCurrentWeather(
          weather.latitude, 
          weather.longitude, 
          newUnit
        );
        setWeather(weatherData);
        
        // Update background based on weather condition
        const condition = getWeatherCondition(weatherData.current.weather_code, weatherData.current.is_day);
        setBackgroundClass(condition.background);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    }
  };

  // Initialize with current location
  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} flex items-center justify-center p-4`}>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleUseCurrentLocation}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-white/30"
            >
              Try Current Location
            </button>
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLoadingLocation={isLoadingLocation}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} transition-all duration-1000`}>
      {loading ? (
        <LoadingSpinner />
      ) : weather ? (
        <div className="container mx-auto px-4 py-8">
          {/* Header with search and refresh */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">WeatherFlow</h1>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-2 transition-all duration-200 text-white/80 hover:text-white disabled:opacity-50"
                title="Refresh weather data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <SearchBar
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLoadingLocation={isLoadingLocation}
            />
          </div>

          {/* Weather content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current weather - spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <CurrentWeather
                weather={weather}
                locationName={locationName}
                temperatureUnit={temperatureUnit}
                onToggleUnit={handleToggleUnit}
                onRefresh={handleRefresh}
                isLoading={loading}
              />
              <WeatherInsight weather={weather} />
              <WeatherFun weather={weather} temperatureUnit={temperatureUnit} />
            </div>

            {/* Forecast - spans 1 column on large screens */}
            <div className="lg:col-span-1">
              <WeatherForecast
                weather={weather}
                temperatureUnit={temperatureUnit}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-white/60 text-sm">
              Weather data provided by{' '}
              <a 
                href="https://open-meteo.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors underline"
              >
                Open-Meteo
              </a>
            </p>
          </footer>
        </div>
      ) : null}
    </div>
  );
}

export default App;