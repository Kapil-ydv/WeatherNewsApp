import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '@shared/schema';
import { useLocation } from '@/contexts/location-context';
import { useSettings } from '@/contexts/settings-context';

export const useWeather = () => {
  const { location } = useLocation();
  const { settings } = useSettings();

  return useQuery<WeatherData>({
    queryKey: ['/api/weather', location?.latitude, location?.longitude, settings.temperatureUnit],
    enabled: !!location?.latitude && !!location?.longitude,
    queryFn: async () => {
      const units = settings.temperatureUnit === 'celsius' ? 'metric' : 'imperial';
      const response = await fetch(
        `/api/weather?lat=${location!.latitude}&lon=${location!.longitude}&units=${units}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
};
