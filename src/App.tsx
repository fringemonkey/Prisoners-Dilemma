import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/ThemeProvider';
import { MainLayout } from './components/Layout/MainLayout';
import { PermutationRunner } from './components/PermutationRunner';
import { SimulationTabs } from './components/SimulationTabs';
import { StrategyManager } from './components/StrategyManager';
import { DataExporter } from './components/DataExporter';
import { Settings } from './components/Settings';
import { useUIStore } from './stores/uiStore';
import { useSimulationStore } from './stores/simulationStore';
import { usePermutationStore } from './stores/permutationStore';
import { FishTankDemo } from './components/FishTankDemo';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const { theme, highContrast, uiScale } = useUIStore();
  const { activeTab } = useUIStore();
  const { runs } = useSimulationStore();
  const { permutations } = usePermutationStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div 
          className={`min-h-screen transition-colors duration-200 ${
            theme === 'dark' 
              ? highContrast ? 'bg-gray-900 text-gray-100' : 'bg-gray-800 text-gray-200'
              : 'bg-gray-50 text-gray-900'
          }`}
          style={{ fontSize: `${uiScale}%` }}
        >
          <MainLayout>
            <div className="flex-1 overflow-hidden">
              {activeTab === 'simulation' && (
                <SimulationTabs />
              )}
              
              {activeTab === 'permutations' && (
                <PermutationRunner />
              )}
              
              {activeTab === 'strategies' && (
                <StrategyManager />
              )}
              
              {activeTab === 'data' && (
                <DataExporter 
                  runs={runs}
                  permutations={permutations}
                />
              )}
              
              {activeTab === 'settings' && (
                <Settings />
              )}
              {activeTab === 'fish' && (
                <FishTankDemo />
              )}
            </div>
          </MainLayout>
          
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#f9fafb' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              },
            }}
          />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
