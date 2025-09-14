import { WeatherData } from '@shared/schema';
import { getWeatherIcon } from '@/types/weather';
import { formatTemperature } from '@/utils/weather-filter';
import { useSettings } from '@/contexts/settings-context';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherCardProps {
  weather?: WeatherData;
  isLoading: boolean;
}

export const WeatherCard = ({ weather, isLoading }: WeatherCardProps) => {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="weather-gradient text-primary-foreground p-6 m-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="text-right">
            <Skeleton className="h-16 w-16 mb-2" />
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-primary-foreground/20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-4 w-4 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto mb-1" />
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-destructive text-destructive-foreground p-6 m-4 rounded-xl shadow-lg">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p className="font-semibold">Weather data unavailable</p>
          <p className="text-sm opacity-80">Please check your location settings</p>
        </div>
      </div>
    );
  }

  const iconClass = getWeatherIcon(weather.current.icon);
  const temperature = formatTemperature(weather.current.temperature, settings.temperatureUnit);
  const feelsLike = formatTemperature(weather.current.feelsLike, settings.temperatureUnit);

  return (
    <div className="weather-gradient text-primary-foreground p-6 m-4 rounded-xl shadow-lg" data-testid="weather-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold" data-testid="text-temperature">{temperature}</h2>
          <p className="text-primary-foreground/80 text-sm capitalize" data-testid="text-condition">
            {weather.current.condition}
          </p>
          <p className="text-primary-foreground/60 text-xs mt-1" data-testid="text-last-updated">
            Updated {new Date(weather.lastUpdated).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        <div className="text-right">
          <i className={`${iconClass} text-4xl mb-2`} data-testid="icon-weather"></i>
          <div className="text-xs text-primary-foreground/80">
            <div data-testid="text-feels-like">Feels like {feelsLike}</div>
            <div data-testid="text-humidity">Humidity {weather.current.humidity}%</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-primary-foreground/20">
        <div className="text-center">
          <i className="fas fa-wind text-lg mb-1"></i>
          <p className="text-xs text-primary-foreground/80">Wind</p>
          <p className="text-sm font-semibold" data-testid="text-wind">
            {weather.current.wind} {settings.temperatureUnit === 'celsius' ? 'km/h' : 'mph'}
          </p>
        </div>
        <div className="text-center">
          <i className="fas fa-eye text-lg mb-1"></i>
          <p className="text-xs text-primary-foreground/80">Visibility</p>
          <p className="text-sm font-semibold" data-testid="text-visibility">
            {weather.current.visibility} {settings.temperatureUnit === 'celsius' ? 'km' : 'mi'}
          </p>
        </div>
        <div className="text-center">
          <i className="fas fa-thermometer-half text-lg mb-1"></i>
          <p className="text-xs text-primary-foreground/80">UV Index</p>
          <p className="text-sm font-semibold" data-testid="text-uv-index">{weather.current.uvIndex}</p>
        </div>
      </div>
    </div>
  );
};
