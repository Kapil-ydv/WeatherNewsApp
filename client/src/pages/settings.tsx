import { useState } from 'react';
import { useSettings } from '@/contexts/settings-context';
import { useLocation } from '@/contexts/location-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface SettingsPageProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsPageProps) {
  const { settings, updateSettings, isLoading } = useSettings();
  const { requestLocation } = useLocation();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const handleTemperatureUnitChange = async (unit: 'celsius' | 'fahrenheit') => {
    await updateSettings({ temperatureUnit: unit });
  };

  const handleNewsCategoryToggle = async (category: string, enabled: boolean) => {
    await updateSettings({
      newsCategories: {
        ...settings.newsCategories,
        [category]: enabled,
      },
    });
  };

  const handleWeatherFilteringToggle = async (enabled: boolean) => {
    await updateSettings({ weatherFiltering: enabled });
  };

  const handleNotificationToggle = async (type: 'weather' | 'news', enabled: boolean) => {
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: enabled,
      },
    });
  };

  const handleLocationToggle = async (enabled: boolean) => {
    if (enabled) {
      await requestLocation();
    }
    await updateSettings({ useCurrentLocation: enabled });
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
    toast({
      title: "Theme Updated",
      description: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
    });
  };

  const handleChangeLocation = async () => {
    await requestLocation();
    toast({
      title: "Location Updated",
      description: "Your location has been refreshed",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto h-full bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-full bg-background" data-testid="settings-page">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4 text-primary-foreground hover:bg-primary-foreground/10"
          onClick={onBack}
          data-testid="button-back"
        >
          <i className="fas fa-arrow-left text-lg"></i>
        </Button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      {/* Settings Content */}
      <div className="p-4 space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-palette mr-2 text-primary"></i>
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                data-testid="switch-dark-mode"
              />
            </div>
          </CardContent>
        </Card>

        {/* Temperature Units */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-thermometer-half mr-2 text-primary"></i>
              Temperature Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={settings.temperatureUnit}
              onValueChange={handleTemperatureUnitChange}
              data-testid="radio-temperature-unit"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="celsius" id="celsius" />
                <Label htmlFor="celsius">Celsius (°C)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* News Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-tags mr-2 text-primary"></i>
              News Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.newsCategories).map(([category, enabled]) => (
              <div key={category} className="flex items-center justify-between">
                <Label htmlFor={category} className="capitalize">
                  {category}
                </Label>
                <Switch
                  id={category}
                  checked={enabled}
                  onCheckedChange={(checked) => handleNewsCategoryToggle(category, checked)}
                  data-testid={`switch-category-${category}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather-based Filtering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-filter mr-2 text-primary"></i>
              Weather-Based News Filtering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weather-filtering">Enable Smart Filtering</Label>
                <p className="text-sm text-muted-foreground">Filter news based on current weather</p>
              </div>
              <Switch
                id="weather-filtering"
                checked={settings.weatherFiltering}
                onCheckedChange={handleWeatherFilteringToggle}
                data-testid="switch-weather-filtering"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-location-dot mr-2 text-primary"></i>
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-location">Use Current Location</Label>
              <Switch
                id="use-location"
                checked={settings.useCurrentLocation}
                onCheckedChange={handleLocationToggle}
                data-testid="switch-use-location"
              />
            </div>
            <Separator />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleChangeLocation}
              data-testid="button-update-location"
            >
              <i className="fas fa-location-arrow mr-2"></i>
              Update Location
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-bell mr-2 text-primary"></i>
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="weather-notifications">Weather Alerts</Label>
              <Switch
                id="weather-notifications"
                checked={settings.notifications.weather}
                onCheckedChange={(checked) => handleNotificationToggle('weather', checked)}
                data-testid="switch-weather-notifications"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="news-notifications">Breaking News</Label>
              <Switch
                id="news-notifications"
                checked={settings.notifications.news}
                onCheckedChange={(checked) => handleNotificationToggle('news', checked)}
                data-testid="switch-news-notifications"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <i className="fas fa-info-circle mr-2 text-primary"></i>
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Version 1.0.0</p>
              <p>Weather data from OpenWeatherMap</p>
              <p>News from NewsAPI</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
