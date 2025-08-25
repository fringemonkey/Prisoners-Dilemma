import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SimulationConfig, 
  SimulationResult,
  Strategy,
  CooperationData,
  PopulationData,
  SimulationRun,
  HeadToHeadMatrix
} from '../types';
import { 
  aggregatedTournament, 
  evolvePopulationWeighted, 
  mulberry32,
  defaultPayoffMatrix 
} from '../utils/gameLogic';
import { allStrategies } from '../utils/strategies';

interface SimulationState {
  runs: SimulationRun[];
  currentRun: SimulationRun | null;
  isRunning: boolean;
  progress: number;
  config: SimulationConfig;
  selectedStrategies: Strategy[];
}

interface SimulationActions {
  // Configuration
  updateConfig: (updates: Partial<SimulationConfig>) => void;
  setSelectedStrategies: (strategyIds: string[]) => void;
  resetConfig: () => void;
  
  // Simulation execution
  runSimulation: (name?: string) => Promise<void>;
  stopSimulation: () => void;
  
  // Results management
  addRun: (run: SimulationRun) => void;
  removeRun: (runId: string) => void;
  clearRuns: () => void;
  setCurrentRun: (run: SimulationRun | null) => void;
  
  // Utilities
  duplicateRun: (runId: string) => void;
  exportRun: (runId: string) => void;
  importRun: (runData: string) => void;
}

const defaultConfig: SimulationConfig = {
  payoffMatrix: defaultPayoffMatrix,
  noise: 0.01,
  rounds: 100,
  populationSize: 1000,
  generations: 100,
  evolutionRate: 0.1,
  replications: 10,
  seed: 123456789,
  selectedStrategies: ['titForTat', 'alwaysCooperate', 'alwaysDefect'],
};

const initialState: SimulationState = {
  runs: [],
  currentRun: null,
  isRunning: false,
  progress: 0,
  config: defaultConfig,
  selectedStrategies: allStrategies.filter(s => 
    defaultConfig.selectedStrategies.includes(s.id)
  ),
};

export const useSimulationStore = create<SimulationState & SimulationActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      updateConfig: (updates) => {
        const newConfig = { ...get().config, ...updates };
        set({ config: newConfig });
        
        // Update selected strategies if strategy selection changed
        if (updates.selectedStrategies) {
          const strategies = allStrategies.filter(s => 
            updates.selectedStrategies!.includes(s.id)
          );
          set({ selectedStrategies: strategies });
        }
      },
      
      setSelectedStrategies: (strategyIds) => {
        const strategies = allStrategies.filter(s => strategyIds.includes(s.id));
        set({ 
          selectedStrategies: strategies,
          config: { ...get().config, selectedStrategies: strategyIds }
        });
      },
      
      resetConfig: () => set({ config: defaultConfig }),
      
      runSimulation: async (name = 'Simulation') => {
        const { config, selectedStrategies } = get();
        
        if (selectedStrategies.length === 0) {
          throw new Error('No strategies selected');
        }
        
        set({ isRunning: true, progress: 0 });
        
        try {
          const startTime = Date.now();
          const rng = mulberry32(config.seed);
          
          // Initialize population
          const initialCount = Math.max(1, Math.floor(config.populationSize / selectedStrategies.length));
          let population: Record<string, number> = {};
          selectedStrategies.forEach((s) => { 
            population[s.id] = initialCount; 
          });
          
          // Distribute remaining population
          let rem = Math.max(0, config.populationSize - initialCount * selectedStrategies.length);
          let ix = 0;
          while (rem-- > 0) {
            population[selectedStrategies[ix % selectedStrategies.length].id]++;
            ix++;
          }
          
          const results: SimulationResult[] = [];
          const coopData: CooperationData[] = [];
          const popData: PopulationData[] = [];
          
          // Run generations
          for (let g = 0; g < config.generations; g++) {
            const { avgPayoffs, coopRates } = aggregatedTournament(
              selectedStrategies, 
              population, 
              config.rounds, 
              config.noise, 
              config.payoffMatrix, 
              config.replications, 
              rng
            );
            
            results.push({ generation: g, ...avgPayoffs });
            coopData.push({ 
              generation: g, 
              ...Object.fromEntries(
                Object.entries(coopRates).map(([k, v]) => [k, Number(v.toFixed(4))])
              )
            });
            popData.push({ generation: g, ...population });
            
            // Evolve population
            population = evolvePopulationWeighted(population, avgPayoffs, config.evolutionRate);
            
            // Update progress
            set({ progress: ((g + 1) / config.generations) * 100 });
            
            // Allow interruption
            if (!get().isRunning) break;
          }
          
          // Calculate final results
          const finalPopulation = population;
          const leaderboard = selectedStrategies
            .map((s) => ({ 
              name: s.name, 
              id: s.id, 
              count: finalPopulation[s.id] || 0 
            }))
            .sort((a, b) => b.count - a.count);
          
          // Calculate head-to-head matrix
          const matrix: HeadToHeadMatrix = {};
          for (let i = 0; i < selectedStrategies.length; i++) {
            matrix[selectedStrategies[i].id] = {};
            for (let j = 0; j < selectedStrategies.length; j++) {
              // This would need the replicateAvg function to be properly implemented
              matrix[selectedStrategies[i].id][selectedStrategies[j].id] = 0;
            }
          }
          
          const run: SimulationRun = {
            id: `run_${Date.now()}`,
            name,
            config,
            results,
            cooperationData: coopData,
            populationData: popData,
            headToHeadMatrix: matrix,
            leaderboard,
            timestamp: new Date(),
            duration: Date.now() - startTime,
            status: 'completed',
            progress: 100,
          };
          
          set((state) => ({
            runs: [run, ...state.runs],
            currentRun: run,
            isRunning: false,
            progress: 100,
          }));
          
        } catch (error) {
          set({ isRunning: false, progress: 0 });
          throw error;
        }
      },
      
      stopSimulation: () => set({ isRunning: false }),
      
      addRun: (run) => set((state) => ({ 
        runs: [run, ...state.runs] 
      })),
      
      removeRun: (runId) => set((state) => ({
        runs: state.runs.filter(r => r.id !== runId),
        currentRun: state.currentRun?.id === runId ? null : state.currentRun,
      })),
      
      clearRuns: () => set({ runs: [], currentRun: null }),
      
      setCurrentRun: (run) => set({ currentRun: run }),
      
      duplicateRun: (runId) => {
        const run = get().runs.find(r => r.id === runId);
        if (run) {
          const duplicated: SimulationRun = {
            ...run,
            id: `run_${Date.now()}`,
            name: `${run.name} (Copy)`,
            timestamp: new Date(),
          };
          set((state) => ({ runs: [duplicated, ...state.runs] }));
        }
      },
      
      exportRun: (runId) => {
        const run = get().runs.find(r => r.id === runId);
        if (run) {
          const dataStr = JSON.stringify(run, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${run.name.replace(/\s+/g, '_')}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }
      },
      
      importRun: (runData) => {
        try {
          const run: SimulationRun = JSON.parse(runData);
          run.id = `run_${Date.now()}`;
          run.timestamp = new Date();
          set((state) => ({ runs: [run, ...state.runs] }));
        } catch (error) {
          throw new Error('Invalid run data format');
        }
      },
    }),
    {
      name: 'simulation-storage',
      partialize: (state) => ({
        runs: state.runs,
        config: state.config,
      }),
    }
  )
);
