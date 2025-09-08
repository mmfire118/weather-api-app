import React from 'react';
import { WeatherData } from '../types/weather';
import { 
  getWeatherCondition, 
  getWeatherIcon, 
  formatTemperature,
  formatDate,
  getUVIndexLevel
} from '../utils/weatherUtils';
import { Droplets, Wind, Sun } from 'lucide-react';

interface WeatherForecastProps {
  weather: WeatherData;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  weather, 
  temperatureUnit 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-6">7-Day Forecast</h3>
      
      <div className="space-y-4">
        {weather.daily.time.slice(0, 7).map((date, index) => {
          const condition = getWeatherCondition(weather.daily.weather_code[index]);
          const WeatherIcon = getWeatherIcon(condition.icon);
          const uvLevel = getUVIndexLevel(weather.daily.uv_index_max[index]);
          
          return (
            <div 
              key={date}
              className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              {/* Main row with day, icon, temps */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-white font-medium min-w-[70px]">
                    {index === 0 ? 'Today' : formatDate(date)}
                  </div>
                  <div className="flex items-center space-x-3">
                    <WeatherIcon className="w-6 h-6 text-white/80" />
                    <span className="text-white/70 text-sm">{condition.description}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-semibold text-lg">
                    {formatTemperature(weather.daily.temperature_2m_max[index], temperatureUnit)}
                  </div>
                  <div className="text-white/60 text-sm">
                    {formatTemperature(weather.daily.temperature_2m_min[index], temperatureUnit)}
                  </div>
                </div>
              </div>

              {/* Details row */}
              <div className="flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center space-x-4">
                  {/* Precipitation */}
                  {weather.daily.precipitation_sum[index] > 0 && (
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3 h-3 text-blue-300" />
                      <span className="text-blue-300">
                        {Math.round(weather.daily.precipitation_sum[index])}mm
                      </span>
                      <span className="text-white/50">
                        ({weather.daily.precipitation_probability_max[index]}%)
                      </span>
                    </div>
                  )}

                  {/* Wind */}
                  <div className="flex items-center space-x-1">
                    <Wind className="w-3 h-3" />
                    <span>{Math.round(weather.daily.wind_speed_10m_max[index])} km/h</span>
                  </div>

                  {/* UV Index */}
                  <div className="flex items-center space-x-1">
                    <Sun className="w-3 h-3 text-yellow-400" />
                    <span className={uvLevel.color}>
                      UV {Math.round(weather.daily.uv_index_max[index])}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly summary */}
      <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
        <h4 className="text-white font-medium mb-3">This Week Summary</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">Avg High</p>
            <p className="text-white font-medium">
              {formatTemperature(
                weather.daily.temperature_2m_max.slice(0, 7).reduce((a, b) => a + b, 0) / 7,
                temperatureUnit
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">Avg Low</p>
            <p className="text-white font-medium">
              {formatTemperature(
                weather.daily.temperature_2m_min.slice(0, 7).reduce((a, b) => a + b, 0) / 7,
                temperatureUnit
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">Total Rain</p>
            <p className="text-white font-medium">
              {Math.round(weather.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + b, 0))}mm
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">Max UV</p>
            <p className="text-white font-medium">
              {Math.round(Math.max(...weather.daily.uv_index_max.slice(0, 7)))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};