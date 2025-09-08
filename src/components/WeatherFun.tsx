import React, { useState } from 'react';
import { Wind, Cloud, Umbrella, Sun, Shirt, Droplets, Gauge, ChevronDown } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { formatTemperature, formatWindDirection, formatDate } from '../utils/weatherUtils';

interface WeatherFunProps {
  weather: WeatherData;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

function getOutfitSuggestion(weather: WeatherData, unit: 'celsius' | 'fahrenheit'): { title: string; details: string[] } {
  const feelsLike = weather.current.apparent_temperature;
  const wind = weather.current.wind_speed_10m;
  const precipProb = weather.daily.precipitation_probability_max[0];
  const uv = weather.daily.uv_index_max[0];

  let title = '';
  if (unit === 'celsius') {
    if (feelsLike <= 3) title = 'Coat, scarf, warm layers';
    else if (feelsLike <= 9) title = 'Jacket + layers';
    else if (feelsLike <= 15) title = 'Light jacket + pants';
    else if (feelsLike <= 21) title = 'T-shirt + jeans';
    else if (feelsLike <= 27) title = 'T-shirt + shorts';
    else title = 'Tank top + shorts';
  } else {
    // Fahrenheit thresholds
    if (feelsLike <= 37) title = 'Coat, scarf, warm layers';
    else if (feelsLike <= 48) title = 'Jacket + layers';
    else if (feelsLike <= 59) title = 'Light jacket + pants';
    else if (feelsLike <= 70) title = 'T-shirt + jeans';
    else if (feelsLike <= 80) title = 'T-shirt + shorts';
    else title = 'Tank top + shorts';
  }

  const details: string[] = [];
  if (wind >= 25) details.push('Windy: add a windbreaker');
  if (precipProb >= 50) details.push('Bring an umbrella');
  else if (precipProb >= 25) details.push('Chance of showers');
  if (uv >= 6) details.push('High UV: sunscreen + hat');

  return { title, details };
}

export const WeatherFun: React.FC<WeatherFunProps> = ({ weather, temperatureUnit }) => {
  const outfit = getOutfitSuggestion(weather, temperatureUnit);
  const windDir = formatWindDirection(weather.current.wind_direction_10m);
  const windSpeed = Math.round(weather.current.wind_speed_10m);
  const windGust = Math.round(weather.current.wind_gusts_10m);
  const cloud = weather.current.cloud_cover;
  const maxTemps = weather.daily.temperature_2m_max.slice(0, 7);
  const minTemps = weather.daily.temperature_2m_min.slice(0, 7);
  const hottestIndex = maxTemps.reduce((bestIdx, t, idx, arr) => (t > arr[bestIdx] ? idx : bestIdx), 0);
  const coldestIndex = minTemps.reduce((bestIdx, t, idx, arr) => (t < arr[bestIdx] ? idx : bestIdx), 0);
  const hottestLabel = formatDate(weather.daily.time[hottestIndex]);
  const coldestLabel = formatDate(weather.daily.time[coldestIndex]);

  const sunshineSeconds = weather.daily.sunshine_duration[0] ?? 0;
  const daylightSeconds = weather.daily.daylight_duration[0] ?? 0;
  const sunshineHours = Math.round((sunshineSeconds / 3600) * 10) / 10;
  const sunshinePct = daylightSeconds > 0 ? Math.min(100, Math.max(0, Math.round((sunshineSeconds / daylightSeconds) * 100))) : 0;

  // Extra fun metrics
  const humidity = weather.current.relative_humidity_2m;
  const temp = weather.current.temperature_2m;
  const feels = weather.current.apparent_temperature;
  const feelsDelta = Math.round(feels - temp);

  function humidityComfort(h: number): { label: string; color: string } {
    if (h < 30) return { label: 'Dry', color: 'text-blue-200' };
    if (h <= 60) return { label: 'Comfortable', color: 'text-green-300' };
    if (h <= 75) return { label: 'Muggy', color: 'text-yellow-300' };
    return { label: 'Humid', color: 'text-orange-300' };
  }

  function activityScore(): { score: number; label: string } {
    // Simple heuristic using feels-like, wind, cloud, rain chance
    let score = 100;
    const feelsC = temperatureUnit === 'celsius' ? feels : ((feels - 32) * 5) / 9;
    if (feelsC < 0) score -= 25; else if (feelsC < 5) score -= 15; else if (feelsC > 32) score -= 25; else if (feelsC > 27) score -= 15;
    if (windSpeed > 30) score -= 10; else if (windSpeed > 20) score -= 5;
    if (cloud > 90) score -= 5;
    const rainProb = weather.daily.precipitation_probability_max[0];
    if (rainProb > 60) score -= 30; else if (rainProb > 30) score -= 10;
    score = Math.max(0, Math.min(100, score));
    let label = 'Great';
    if (score < 30) label = 'Poor'; else if (score < 60) label = 'Okay'; else if (score < 80) label = 'Good';
    return { score, label };
  }

  const comfort = humidityComfort(humidity);
  const act = activityScore();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Outfit & Extras</h3>
        <button
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          title={isExpanded ? 'Collapse' : 'Expand'}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
        </button>
      </div>
      {isExpanded && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Outfit Helper */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Suggestion based on feels-like temp, wind, rain chance, and UV">
          <div className="flex items-center space-x-3 mb-2">
            <Shirt className="w-5 h-5 text-white/80" />
            <div className="text-white/70 text-sm">Outfit helper</div>
          </div>
          <div className="text-white font-medium mb-1">{outfit.title}</div>
          <div className="text-white/70 text-sm">
            Feels like {formatTemperature(weather.current.apparent_temperature, temperatureUnit)}
          </div>
          {outfit.details.length > 0 && (
            <ul className="mt-2 space-y-1 text-white/70 text-xs">
              {outfit.details.map((d, i) => (
                <li key={i} className="flex items-center space-x-2">
                  {d.includes('umbrella') ? (
                    <Umbrella className="w-3 h-3 text-blue-300" />
                  ) : d.includes('UV') ? (
                    <Sun className="w-3 h-3 text-yellow-300" />
                  ) : (
                    <Shirt className="w-3 h-3 text-white/60" />
                  )}
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Wind Compass */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Arrow shows wind direction (from). Speed and gusts in km/h">
          <div className="flex items-center space-x-3 mb-2">
            <Wind className="w-5 h-5 text-white/80" />
            <div className="text-white/70 text-sm">Wind</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/10">
              <div
                className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white/80"
                style={{ transform: `rotate(${weather.current.wind_direction_10m}deg)` }}
                aria-label={`Direction ${windDir}`}
              />
            </div>
            <div>
              <div className="text-white font-medium">{windSpeed} km/h {windDir}</div>
              <div className="text-white/70 text-xs">Gusts {windGust} km/h</div>
            </div>
          </div>
        </div>

        {/* Sky Meter */
        }
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Current cloud cover percentage">
          <div className="flex items-center space-x-3 mb-2">
            <Cloud className="w-5 h-5 text-white/80" />
            <div className="text-white/70 text-sm">Sky meter</div>
          </div>
          <div className="text-white font-medium mb-2">Cloud cover {cloud}%</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-white/70"
              style={{ width: `${Math.max(0, Math.min(100, cloud))}%` }}
            />
          </div>
        </div>

        {/* Sunshine Hours */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Estimated sunshine duration today and share of daylight">
          <div className="flex items-center space-x-3 mb-2">
            <Sun className="w-5 h-5 text-yellow-300" />
            <div className="text-white/70 text-sm">Sunshine today</div>
          </div>
          <div className="text-white font-medium mb-2">{sunshineHours.toFixed(1)}h</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-yellow-300"
              style={{ width: `${sunshinePct}%` }}
            />
          </div>
          <div className="text-white/60 text-xs mt-2">{sunshinePct}% of daylight</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Humidity Comfort */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Comfort range ~30–60% RH; simple qualitative scale">
          <div className="flex items-center space-x-3 mb-2">
            <Droplets className="w-5 h-5 text-white/80" />
            <div className="text-white/70 text-sm">Humidity comfort</div>
          </div>
          <div className="text-white font-medium">{humidity}% • <span className={comfort.color}>{comfort.label}</span></div>
        </div>

        {/* Feels-like Delta */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Difference between apparent and actual temperature">
          <div className="flex items-center space-x-3 mb-2">
            <Gauge className="w-5 h-5 text-white/80" />
            <div className="text-white/70 text-sm">Feels-like delta</div>
          </div>
          <div className="text-white font-medium">
            {feelsDelta === 0 ? 'Matches actual' : feelsDelta > 0 ? `Feels ${Math.abs(feelsDelta)}° warmer` : `Feels ${Math.abs(feelsDelta)}° cooler`}
          </div>
        </div>

        {/* Activity Score */}
        <div className="bg-white/10 rounded-xl p-4 border border-white/20" title="Heuristic score using temp, wind, rain chance, and clouds">
          <div className="flex items-center space-x-3 mb-2">
            <Sun className="w-5 h-5 text-white/80" />
            <div className="text-white/70 text-sm">Outdoor score</div>
          </div>
          <div className="text-white font-medium">{act.score}/100 • {act.label}</div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20 mt-2">
            <div
              className="h-full bg-green-300"
              style={{ width: `${act.score}%` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 p-4 bg-white/10 rounded-xl border border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-white/70 text-xs">Hottest day (next 7 days)</div>
          <div className="text-white font-medium">{hottestLabel} • {formatTemperature(maxTemps[hottestIndex], temperatureUnit)}</div>
        </div>
        <div>
          <div className="text-white/70 text-xs">Coldest night (next 7 days)</div>
          <div className="text-white font-medium">{coldestLabel} • {formatTemperature(minTemps[coldestIndex], temperatureUnit)}</div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};


