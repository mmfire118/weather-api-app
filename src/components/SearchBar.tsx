import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { WeatherService } from '../services/weatherService';
import { LocationData } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (latitude: number, longitude: number, locationName: string) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onLocationSelect, 
  onUseCurrentLocation,
  isLoadingLocation = false 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await WeatherService.searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleLocationSelect = (location: LocationData) => {
    const locationName = `${location.name}, ${location.country}`;
    setQuery(locationName);
    setShowSuggestions(false);
    onLocationSelect(location.latitude, location.longitude, locationName);
    inputRef.current?.blur();
  };

  const handleCurrentLocation = () => {
    setQuery('');
    setShowSuggestions(false);
    onUseCurrentLocation();
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-12 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        />
        <button
          onClick={handleCurrentLocation}
          disabled={isLoadingLocation}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200 disabled:opacity-50"
          title="Use current location"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </button>
      </div>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-white/70">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : (
            suggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/20 transition-colors duration-200 border-b border-white/10 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="font-medium">{location.name}</div>
                <div className="text-sm text-white/70">
                  {location.admin1 && `${location.admin1}, `}{location.country}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};