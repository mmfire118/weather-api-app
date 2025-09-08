import { WeatherCondition } from '../types/weather';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  Eye,
  EyeOff,
  type LucideIcon
} from 'lucide-react';

export const weatherConditions: Record<number, WeatherCondition> = {
  0: {
    code: 0,
    description: 'Clear sky',
    icon: 'Sun',
    background: 'from-blue-400 via-purple-400 to-orange-300',
    textColor: 'text-white'
  },
  1: {
    code: 1,
    description: 'Mainly clear',
    icon: 'Sun',
    background: 'from-blue-400 via-blue-500 to-blue-600',
    textColor: 'text-white'
  },
  2: {
    code: 2,
    description: 'Partly cloudy',
    icon: 'Cloud',
    background: 'from-gray-400 via-gray-500 to-blue-500',
    textColor: 'text-white'
  },
  3: {
    code: 3,
    description: 'Overcast',
    icon: 'Cloud',
    background: 'from-gray-500 via-gray-600 to-gray-700',
    textColor: 'text-white'
  },
  45: {
    code: 45,
    description: 'Fog',
    icon: 'EyeOff',
    background: 'from-gray-300 via-gray-400 to-gray-500',
    textColor: 'text-white'
  },
  48: {
    code: 48,
    description: 'Depositing rime fog',
    icon: 'EyeOff',
    background: 'from-gray-300 via-gray-400 to-gray-500',
    textColor: 'text-white'
  },
  51: {
    code: 51,
    description: 'Light drizzle',
    icon: 'CloudRain',
    background: 'from-gray-400 via-blue-400 to-blue-500',
    textColor: 'text-white'
  },
  53: {
    code: 53,
    description: 'Moderate drizzle',
    icon: 'CloudRain',
    background: 'from-gray-500 via-blue-500 to-blue-600',
    textColor: 'text-white'
  },
  55: {
    code: 55,
    description: 'Dense drizzle',
    icon: 'CloudRain',
    background: 'from-gray-600 via-blue-600 to-blue-700',
    textColor: 'text-white'
  },
  61: {
    code: 61,
    description: 'Slight rain',
    icon: 'CloudRain',
    background: 'from-blue-500 via-blue-600 to-gray-600',
    textColor: 'text-white'
  },
  63: {
    code: 63,
    description: 'Moderate rain',
    icon: 'CloudRain',
    background: 'from-blue-600 via-gray-600 to-gray-700',
    textColor: 'text-white'
  },
  65: {
    code: 65,
    description: 'Heavy rain',
    icon: 'CloudRain',
    background: 'from-gray-700 via-gray-800 to-blue-800',
    textColor: 'text-white'
  },
  71: {
    code: 71,
    description: 'Slight snow',
    icon: 'CloudSnow',
    background: 'from-blue-200 via-blue-300 to-gray-400',
    textColor: 'text-gray-800'
  },
  73: {
    code: 73,
    description: 'Moderate snow',
    icon: 'CloudSnow',
    background: 'from-blue-300 via-gray-300 to-gray-500',
    textColor: 'text-white'
  },
  75: {
    code: 75,
    description: 'Heavy snow',
    icon: 'CloudSnow',
    background: 'from-gray-400 via-gray-500 to-gray-600',
    textColor: 'text-white'
  },
  95: {
    code: 95,
    description: 'Thunderstorm',
    icon: 'Zap',
    background: 'from-gray-800 via-purple-800 to-yellow-600',
    textColor: 'text-white'
  },
  96: {
    code: 96,
    description: 'Thunderstorm with hail',
    icon: 'Zap',
    background: 'from-gray-900 via-purple-900 to-yellow-700',
    textColor: 'text-white'
  }
};

export function getWeatherCondition(code: number, isDay?: number): WeatherCondition {
  const condition = weatherConditions[code] || weatherConditions[0];
  
  // Adjust for night time
  if (isDay === 0 && (code === 0 || code === 1)) {
    return {
      ...condition,
      icon: 'Moon',
      background: 'from-indigo-900 via-purple-900 to-pink-800',
      description: condition.description.replace('Clear', 'Clear night')
    };
  }
  
  return condition;
}

export function getWeatherIcon(iconName: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    Sun,
    Moon,
    Cloud,
    CloudRain,
    CloudSnow,
    Zap,
    Eye,
    EyeOff
  };
  
  return icons[iconName] || Sun;
}

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  return `${Math.round(temp)}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

export function getUVIndexLevel(uvIndex: number): { level: string; color: string } {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500' };
  return { level: 'Extreme', color: 'text-purple-500' };
}