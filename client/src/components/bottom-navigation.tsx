interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'home', icon: 'fas fa-home', label: 'Home' },
    { id: 'forecast', icon: 'fas fa-cloud-sun', label: 'Forecast' },
    { id: 'news', icon: 'fas fa-newspaper', label: 'News' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border" data-testid="bottom-navigation">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 p-4 text-center transition-colors ${
              activeTab === tab.id 
                ? 'tab-active' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onTabChange(tab.id)}
            data-testid={`tab-${tab.id}`}
          >
            <i className={`${tab.icon} text-lg mb-1 block`}></i>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
