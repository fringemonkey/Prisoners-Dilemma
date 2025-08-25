import React from 'react';
import { 
  Play, 
  BarChart3, 
  Settings, 
  Database, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Gamepad2
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useTheme } from '@/components/ThemeProvider';

const navigationItems = [
  {
    id: 'simulation',
    name: 'Simulation',
    icon: Play,
    description: 'Run single simulations',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 'permutations',
    name: 'Permutations',
    icon: Zap,
    description: 'Batch parameter testing',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 'strategies',
    name: 'Strategies',
    icon: Gamepad2,
    description: 'Manage game strategies',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    id: 'data',
    name: 'Data',
    icon: Database,
    description: 'Export and analyze results',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    description: 'App preferences and theme',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20'
  }
];

export const Sidebar: React.FC = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    activeTab, 
    setActiveTab,
    theme,
    highContrast 
  } = useUIStore();
  const { toggleTheme } = useTheme();

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Prisoner's Dilemma
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? `${item.bgColor} ${item.color} border-l-4 border-l-current` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <div className="ml-3 text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm opacity-75">{item.description}</div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <div className="space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <BarChart3 size={20} className="text-gray-600 dark:text-gray-300" />
              {!sidebarCollapsed && (
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Toggle Theme
                </span>
              )}
            </button>
            
            {/* High Contrast Toggle */}
            <button
              onClick={() => useUIStore.getState().setHighContrast(!highContrast)}
              className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
                highContrast 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Settings size={20} />
              {!sidebarCollapsed && (
                <span className="ml-2 text-sm">
                  {highContrast ? 'High Contrast' : 'Normal Contrast'}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
