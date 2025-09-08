import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Eye,
  Sun,
  CloudRain
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { 
  getWeatherCondition, 
  getWeatherIcon, 
  formatTemperature,
  formatWindDirection,
  formatTime
} from '../utils/weatherUtils';

interface CurrentWeatherProps {
  weather: WeatherData;
  locationName: string;
  temperatureUnit: 'celsius' | 'fahrenheit';
  onToggleUnit: () => void;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ 
  weather, 
  locationName,
  temperatureUnit,
  onToggleUnit
}) => {
  const condition = getWeatherCondition(weather.current.weather_code, weather.current.is_day);
  const WeatherIcon = getWeatherIcon(condition.icon);
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const weatherDetails = [
    {
      icon: Thermometer,
      label: 'Feels like',
      value: formatTemperature(weather.current.apparent_temperature, temperatureUnit)
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.current.relative_humidity_2m}%`
    },
    {
      icon: Wind,
      label: 'Wind',
      value: `${Math.round(weather.current.wind_speed_10m)} km/h ${formatWindDirection(weather.current.wind_direction_10m)}`
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${Math.round(weather.current.pressure_msl)} hPa`
    },
    {
      icon: Eye,
      label: 'Cloud Cover',
      value: `${weather.current.cloud_cover}%`
    },
    {
      icon: CloudRain,
      label: 'Precipitation',
      value: `${weather.current.precipitation} mm`
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{locationName}</h2>
          <p className="text-white/70">Today • {currentTime}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleUnit}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-all duration-200 text-white/80 hover:text-white text-sm font-medium"
            title={`Switch to ${temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}`}
          >
            °{temperatureUnit === 'celsius' ? 'F' : 'C'}
          </button>
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-full p-4">
            <WeatherIcon className="w-12 h-12 text-white" />
          </div>
          <div>
            <div className="text-5xl font-light text-white mb-1">
              {formatTemperature(weather.current.temperature_2m, temperatureUnit)}
            </div>
            <p className="text-white/80 text-lg">{condition.description}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-white/70 text-sm mb-2">
            {weather.current.is_day ? 'Day' : 'Night'}
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <Sun className="w-5 h-5 text-yellow-300 mb-1" />
            <p className="text-white/80 text-sm">
              {formatTime(weather.daily.sunrise[0])} - {formatTime(weather.daily.sunset[0])}
            </p>
          </div>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {weatherDetails.map((detail, index) => (
          <div 
            key={index}
            className="bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <detail.icon className="w-5 h-5 text-white/70" />
              <div>
                <p className="text-white/70 text-sm">{detail.label}</p>
                <p className="text-white font-medium">{detail.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};