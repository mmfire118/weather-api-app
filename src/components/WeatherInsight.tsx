import React from 'react';
import { Sun, CloudRain, AlertTriangle } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getUVIndexLevel, formatTime } from '../utils/weatherUtils';

interface WeatherInsightProps {
  weather: WeatherData;
}

function getTimeUntil(targetIso: string): string {
  const now = new Date();
  const target = new Date(targetIso);
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'now';
  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export const WeatherInsight: React.FC<WeatherInsightProps> = ({ weather }) => {
  const isDay = weather.current.is_day === 1;
  const sunrise = weather.daily.sunrise[0];
  const sunset = weather.daily.sunset[0];
  const nextEventLabel = isDay ? 'Sunset' : 'Sunrise';
  const nextEventTime = isDay ? sunset : sunrise;
  const timeUntil = getTimeUntil(nextEventTime);

  const uv = weather.daily.uv_index_max[0];
  const uvInfo = getUVIndexLevel(uv);
  const uvTip = uv >= 6 ? 'Wear sunscreen and seek shade at midday.' : uv >= 3 ? 'Consider SPF and sunglasses.' : 'Low risk today.';

  const precipProb = weather.daily.precipitation_probability_max[0];
  const precipText = precipProb >= 60 ? 'High chance of rain—bring an umbrella.' : precipProb >= 30 ? 'Possible showers later.' : 'Unlikely to rain.';

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Today Insight</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 border border-white/20">
          <Sun className="w-5 h-5 text-yellow-300" />
          <div>
            <div className="text-white/70 text-sm">{nextEventLabel}</div>
            <div className="text-white font-medium">{formatTime(nextEventTime)} • in {timeUntil}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 border border-white/20">
          <AlertTriangle className={`w-5 h-5 ${uvInfo.color}`} />
          <div>
            <div className="text-white/70 text-sm">UV Index</div>
            <div className="text-white font-medium">{Math.round(uv)} • {uvInfo.level}</div>
            <div className="text-white/70 text-xs mt-1">{uvTip}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 border border-white/20">
          <CloudRain className="w-5 h-5 text-blue-300" />
          <div>
            <div className="text-white/70 text-sm">Rain Chance</div>
            <div className="text-white font-medium">{precipProb}%</div>
            <div className="text-white/70 text-xs mt-1">{precipText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


