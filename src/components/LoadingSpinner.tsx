import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <span className="ml-4 text-white text-lg font-medium">Loading weather data...</span>
    </div>
  );
};