import { WeatherData, LocationData } from '../types/weather';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

export class WeatherService {
  static async getCurrentWeather(
    latitude: number,
    longitude: number,
    temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius'
  ): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'daylight_duration',
        'sunshine_duration',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      temperature_unit: temperatureUnit,
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      timeformat: 'iso8601',
      forecast_days: '7',
      timezone: 'auto'
    });

    const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return await response.json();
  }

  static async searchLocations(query: string): Promise<LocationData[]> {
    if (query.length < 2) return [];

    const params = new URLSearchParams({
      name: query,
      count: '10',
      language: 'en',
      format: 'json'
    });

    const response = await fetch(`${GEOCODING_API_BASE}/search?${params}`);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  static getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}