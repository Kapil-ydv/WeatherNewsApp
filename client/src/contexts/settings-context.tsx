import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: UserSettings = {
  temperatureUnit: 'fahrenheit',
  newsCategories: {
    general: true,
    technology: true,
    health: false,
    sports: false,
    entertainment: false,
  },
  weatherFiltering: true,
  useCurrentLocation: true,
  notifications: {
    weather: true,
    news: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const userId = 'default-user'; // In a real app, this would come from auth

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`/api/settings/${userId}`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const userSettings = await response.json();
        setSettings({ ...defaultSettings, ...userSettings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to load user settings. Using defaults.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const response = await apiRequest('PUT', `/api/settings/${userId}`, updatedSettings);
      
      if (response.ok) {
        const savedSettings = await response.json();
        setSettings(savedSettings);
        toast({
          title: "Settings Updated",
          description: "Your preferences have been saved.",
        });
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Settings Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};
