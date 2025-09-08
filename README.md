# WeatherFlow – Modern Weather App

A polished React + TypeScript weather app using Open‑Meteo. It auto‑detects your location, supports fast city search, and presents rich current and 7‑day forecasts with a clean, animated UI.

## Features

- Current weather with dynamic icon, description, sunrise/sunset window, and details:
  - Temperature and feels‑like, humidity, wind, pressure, cloud cover, precipitation
- 7‑Day forecast with daily icon/summary, high/low, rain probability, wind, UV
- Weekly summary: average highs/lows, total rainfall, max UV
- Always‑visible insights:
  - Today Insight: time to next sun event, UV level with tip, rain chance
  - Outfit & Extras card (collapsible):
    - Outfit Helper suggestion + contextual tips (umbrella, UV, wind)
    - Wind Compass (direction, speed, gusts)
    - Sky Meter (cloud cover bar)
    - Sunshine Today (hours and share of daylight)
    - Humidity Comfort, Feels‑like Delta, Outdoor Activity Score
    - Weekly extremes: “Hottest day (next 7 days)” and “Coldest night (next 7 days)”
- Temperature unit toggle (°C/°F) and refresh
- Debounced city search with suggestions and "use current location"
- Responsive, glass‑style UI with Tailwind and lucide‑react icons

## Tech Stack

- React 18, TypeScript
- Vite, Tailwind CSS
- Open‑Meteo Weather + Geocoding APIs
- lucide‑react icons

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Vite will print a local URL, typically `http://localhost:5173`.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

- `src/App.tsx` – App shell, search, units, background logic, layout
- `src/components/CurrentWeather.tsx` – Current conditions card
- `src/components/WeatherForecast.tsx` – 7‑day forecast + weekly summary
- `src/components/WeatherInsight.tsx` – Today Insight card (sun event, UV, rain)
- `src/components/WeatherFun.tsx` – Outfit & Extras card with fun tiles
- `src/services/weatherService.ts` – API calls (forecast + geocoding)
- `src/utils/weatherUtils.ts` – Formatting, condition mapping, icons, helpers
- `src/types/weather.ts` – Typed API response shapes

## Data & Units

- Source: `https://open-meteo.com/` (no API key required)
- Units:
  - Temperature: °C/°F toggle
  - Wind: km/h (can be extended to mph)
  - Precipitation: mm
  - Timezone and times auto‑localized by the API

## Accessibility

- Keyboard focusable search
- Clear labels and tooltips for fun tiles
- High‑contrast glass UI; further ARIA roles can be added as needed
