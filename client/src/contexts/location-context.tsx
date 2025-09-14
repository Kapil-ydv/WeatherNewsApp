import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation is not supported by this browser';
      setError(errorMsg);
      toast({
        title: "Location Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY || ''}`
          );
          
          let city = 'Unknown';
          let country = '';
          
          if (response.ok) {
            const geocodeData = await response.json();
            if (geocodeData.length > 0) {
              city = geocodeData[0].name;
              country = geocodeData[0].country;
            }
          }

          setLocation({
            latitude,
            longitude,
            city,
            country,
          });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setLocation({
            latitude,
            longitude,
            city: 'Unknown',
            country: '',
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        let errorMsg = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out';
            break;
        }
        
        setError(errorMsg);
        setIsLoading(false);
        toast({
          title: "Location Error",
          description: errorMsg,
          variant: "destructive",
        });
      },
      options
    );
  };

  return (
    <LocationContext.Provider value={{ location, isLoading, error, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
