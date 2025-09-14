import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/settings-context";
import { LocationProvider } from "@/contexts/location-context";
import { BottomNavigation } from "@/components/bottom-navigation";
import Home from "@/pages/home";
import Settings from "@/pages/settings";
import { Button } from "@/components/ui/button";

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
      case 'forecast':
      case 'news':
        return <Home />;
      case 'settings':
        return <Settings onBack={() => setActiveTab('home')} />;
      default:
        return <Home />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <LocationProvider>
            <div className="min-h-screen bg-background text-foreground">
              {/* Header - only show on non-settings pages */}
              {activeTab !== 'settings' && (
                <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between max-w-md mx-auto">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-cloud-sun text-xl"></i>
                    <h1 className="text-lg font-semibold">WeatherNews</h1>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground"
                      onClick={toggleDarkMode}
                      data-testid="button-toggle-theme"
                    >
                      <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors text-primary-foreground"
                      onClick={() => setActiveTab('settings')}
                      data-testid="button-open-settings"
                    >
                      <i className="fas fa-cog text-sm"></i>
                    </Button>
                  </div>
                </header>
              )}

              {/* Main Content */}
              {renderContent()}

              {/* Bottom Navigation - only show on non-settings pages */}
              {activeTab !== 'settings' && (
                <BottomNavigation 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
              )}
            </div>
            <Toaster />
          </LocationProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
