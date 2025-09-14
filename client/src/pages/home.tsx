import { useState, useEffect } from 'react';
import { WeatherCard } from '@/components/weather-card';
import { ForecastList } from '@/components/forecast-list';
import { NewsList } from '@/components/news-list';
import { useWeather } from '@/hooks/use-weather';
import { useNews } from '@/hooks/use-news';
import { useLocation } from '@/contexts/location-context';
import { useSettings } from '@/contexts/settings-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';

export default function Home() {
  const { location, isLoading: locationLoading, requestLocation } = useLocation();
  const { settings } = useSettings();
  const { toast } = useToast();
  const [newsPage, setNewsPage] = useState(1);
  const [allArticles, setAllArticles] = useState<any[]>([]);

  const { 
    data: weather, 
    isLoading: weatherLoading, 
    error: weatherError 
  } = useWeather();

  const { 
    data: news, 
    isLoading: newsLoading, 
    refetch: refetchNews 
  } = useNews({
    temperature: weather?.current.temperature,
    condition: weather?.current.condition,
    page: newsPage,
    pageSize: 10,
  });

  // Accumulate articles from different pages
  useEffect(() => {
    if (news?.articles) {
      if (newsPage === 1) {
        setAllArticles(news.articles);
      } else {
        setAllArticles(prev => [...prev, ...news.articles]);
      }
    }
  }, [news, newsPage]);

  const handleRefreshNews = async () => {
    setNewsPage(1);
    setAllArticles([]);
    await refetchNews();
    toast({
      title: "News Refreshed",
      description: "Latest headlines have been loaded.",
    });
  };

  const handleLoadMore = () => {
    setNewsPage(prev => prev + 1);
  };

  const handleLocationRefresh = async () => {
    await requestLocation();
    // Invalidate weather queries to refetch with new location
    queryClient.invalidateQueries({ queryKey: ['/api/weather'] });
  };

  const hasMoreNews = news ? (allArticles.length < news.totalResults) : false;

  if (locationLoading) {
    return (
      <div className="max-w-md mx-auto bg-card shadow-xl min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Getting your location...</h2>
          <p className="text-muted-foreground text-sm">Please allow location access for weather data</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="max-w-md mx-auto bg-card shadow-xl min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <i className="fas fa-location-slash text-4xl text-destructive mb-4"></i>
          <h2 className="text-lg font-semibold mb-2">Location Required</h2>
          <p className="text-muted-foreground text-sm mb-4">
            We need your location to provide weather data and personalized news.
          </p>
          <Button onClick={handleLocationRefresh} data-testid="button-enable-location">
            <i className="fas fa-location-dot mr-2"></i>
            Enable Location
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-card shadow-xl min-h-screen relative">
      {/* Location Banner */}
      <div className="bg-accent text-accent-foreground p-3 flex items-center justify-center space-x-2 border-b border-border">
        <i className="fas fa-location-dot text-sm"></i>
        <span className="text-sm font-medium" data-testid="text-location">
          {location.city ? `${location.city}, ${location.country}` : 'Current Location'}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs underline h-auto p-0"
          onClick={handleLocationRefresh}
          data-testid="button-change-location"
        >
          Change
        </Button>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        <WeatherCard weather={weather} isLoading={weatherLoading} />
        
        <ForecastList weather={weather} isLoading={weatherLoading} />
        
        <NewsList 
          news={{ articles: allArticles, totalResults: news?.totalResults || 0 }}
          isLoading={newsLoading && newsPage === 1}
          temperature={weather?.current.temperature}
          condition={weather?.current.condition}
          onRefresh={handleRefreshNews}
          onLoadMore={handleLoadMore}
          hasMore={hasMoreNews}
        />
      </div>
    </div>
  );
}
