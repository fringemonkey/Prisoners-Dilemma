import React from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useSimulationStore } from '@/stores/simulationStore';
import { usePermutationStore } from '@/stores/permutationStore';
import { 
  Play, 
  Square, 
  Download, 
  RefreshCw, 
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';

const getTabTitle = (tabId: string) => {
  const titles: Record<string, string> = {
    simulation: 'Simulation',
    permutations: 'Permutations',
    strategies: 'Strategies',
    data: 'Data & Export',
    settings: 'Settings'
  };
  return titles[tabId] || 'Unknown';
};

const getTabIcon = (tabId: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    simulation: Play,
    permutations: Zap,
    strategies: TrendingUp,
    data: Download,
    settings: Clock
  };
  return icons[tabId] || Clock;
};

export const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();
  const { isRunning, stopSimulation, progress } = useSimulationStore();
  const { isRunning: isPermRunning, stopPermutation, progress: permProgress } = usePermutationStore();

  const Icon = getTabIcon(activeTab);
  const title = getTabTitle(activeTab);
  const isAnyRunning = isRunning || isPermRunning;
  const currentProgress = isRunning ? progress : permProgress;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Breadcrumb and title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon size={24} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          
          {/* Progress bar for running simulations */}
          {isAnyRunning && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <RefreshCw size={16} className="animate-spin text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Running...
                </span>
              </div>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {Math.round(currentProgress)}%
              </span>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Stop button when running */}
          {isAnyRunning && (
            <button
              onClick={() => {
                if (isRunning) stopSimulation();
                if (isPermRunning) stopPermutation();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Square size={16} />
              <span>Stop</span>
            </button>
          )}

          {/* Quick actions based on current tab */}
          {activeTab === 'simulation' && !isRunning && (
            <button
              onClick={() => useSimulationStore.getState().runSimulation()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Play size={16} />
              <span>Run Simulation</span>
            </button>
          )}

          {activeTab === 'permutations' && !isPermRunning && (
            <button
              onClick={() => {
                const currentPerm = usePermutationStore.getState().currentPermutation;
                if (currentPerm) {
                  usePermutationStore.getState().runPermutation(currentPerm.id);
                }
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Zap size={16} />
              <span>Run Permutation</span>
            </button>
          )}

          {/* Global actions */}
          <button
            onClick={() => {
              // Refresh current data
              window.location.reload();
            }}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
