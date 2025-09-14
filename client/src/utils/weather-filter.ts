import { NewsFilterInfo } from "../types/news";

export const getNewsFilterInfo = (temperature?: number, condition?: string): NewsFilterInfo => {
  if (!temperature || !condition) {
    return {
      isActive: false,
      reason: 'No weather data available',
      keywords: [],
    };
  }

  if (temperature < 50) {
    return {
      isActive: true,
      reason: 'Cold weather - Showing challenging news',
      keywords: ['tragedy', 'crisis', 'disaster', 'conflict'],
    };
  } else if (temperature > 80) {
    return {
      isActive: true,
      reason: 'Hot weather - Showing cautionary news',
      keywords: ['danger', 'threat', 'risk', 'warning'],
    };
  } else {
    return {
      isActive: true,
      reason: 'Cool weather - Showing positive news',
      keywords: ['success', 'victory', 'achievement', 'breakthrough'],
    };
  }
};

export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit'): string => {
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

export const convertTemperature = (temp: number, from: 'celsius' | 'fahrenheit', to: 'celsius' | 'fahrenheit'): number => {
  if (from === to) return temp;
  
  if (from === 'fahrenheit' && to === 'celsius') {
    return (temp - 32) * 5/9;
  } else {
    return (temp * 9/5) + 32;
  }
};
