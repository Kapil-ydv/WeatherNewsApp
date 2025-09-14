import { WeatherData } from '@shared/schema';
import { getWeatherIcon } from '@/types/weather';
import { formatTemperature } from '@/utils/weather-filter';
import { useSettings } from '@/contexts/settings-context';
import { Skeleton } from '@/components/ui/skeleton';

interface ForecastListProps {
  weather?: WeatherData;
  isLoading: boolean;
}

export const ForecastList = ({ weather, isLoading }: ForecastListProps) => {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="mx-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-calendar-days mr-2 text-primary"></i>
          5-Day Forecast
        </h3>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="forecast-item bg-card border border-border rounded-lg p-3 text-center shadow-sm">
              <Skeleton className="h-3 w-12 mx-auto mb-2" />
              <Skeleton className="h-6 w-6 mx-auto mb-2" />
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-6 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather?.forecast?.length) {
    return (
      <div className="mx-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-calendar-days mr-2 text-primary"></i>
          5-Day Forecast
        </h3>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-muted-foreground">Forecast data unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fas fa-calendar-days mr-2 text-primary"></i>
        5-Day Forecast
      </h3>
      <div className="flex space-x-3 overflow-x-auto pb-2" data-testid="forecast-list">
        {weather.forecast.map((day, index) => {
          const iconClass = getWeatherIcon(day.icon);
          const high = formatTemperature(day.high, settings.temperatureUnit);
          const low = formatTemperature(day.low, settings.temperatureUnit);
          
          return (
            <div 
              key={`${day.date}-${index}`} 
              className="forecast-item bg-card border border-border rounded-lg p-3 text-center shadow-sm"
              data-testid={`forecast-item-${index}`}
            >
              <p className="text-xs text-muted-foreground mb-1" data-testid={`text-day-${index}`}>
                {day.dayName}
              </p>
              <i className={`${iconClass} text-lg mb-2`} data-testid={`icon-forecast-${index}`}></i>
              <p className="text-sm font-semibold" data-testid={`text-high-${index}`}>
                {high}
              </p>
              <p className="text-xs text-muted-foreground" data-testid={`text-low-${index}`}>
                {low}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
