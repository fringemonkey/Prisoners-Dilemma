import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  PermutationConfig, 
  SimulationConfig, 
  SimulationRun 
} from '@/types';
import { generatePermutations } from '@/utils/gameLogic';
import { useSimulationStore } from './simulationStore';

interface PermutationState {
  permutations: PermutationConfig[];
  currentPermutation: PermutationConfig | null;
  isRunning: boolean;
  progress: number;
}

interface PermutationActions {
  // Permutation management
  createPermutation: (name: string, baseConfig: SimulationConfig, variations: any) => void;
  removePermutation: (id: string) => void;
  clearPermutations: () => void;
  setCurrentPermutation: (permutation: PermutationConfig | null) => void;
  
  // Execution
  runPermutation: (id: string) => Promise<void>;
  stopPermutation: (id: string) => void;
  
  // Utilities
  duplicatePermutation: (id: string) => void;
  exportPermutation: (id: string) => void;
  importPermutation: (data: string) => void;
}

const initialState: PermutationState = {
  permutations: [],
  currentPermutation: null,
  isRunning: false,
  progress: 0,
};

export const usePermutationStore = create<PermutationState & PermutationActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      createPermutation: (name, baseConfig, variations) => {
        const permutation: PermutationConfig = {
          id: `perm_${Date.now()}`,
          name,
          baseConfig,
          variations,
          status: 'pending',
          runs: [],
          createdAt: new Date(),
        };
        
        set((state) => ({
          permutations: [permutation, ...state.permutations],
        }));
      },
      
      removePermutation: (id) => set((state) => ({
        permutations: state.permutations.filter(p => p.id !== id),
        currentPermutation: state.currentPermutation?.id === id ? null : state.currentPermutation,
      })),
      
      clearPermutations: () => set({ permutations: [], currentPermutation: null }),
      
      setCurrentPermutation: (permutation) => set({ currentPermutation: permutation }),
      
      runPermutation: async (id) => {
        const permutation = get().permutations.find(p => p.id === id);
        if (!permutation) return;
        
        set({ isRunning: true, progress: 0, currentPermutation: permutation });
        
        try {
          // Generate all parameter combinations
          const combinations = generateParameterCombinations(permutation.baseConfig, permutation.variations);
          
          // Update status
          set((state) => ({
            permutations: state.permutations.map(p => 
              p.id === id ? { ...p, status: 'running' } : p
            ),
          }));
          
          // Run each combination
          for (let i = 0; i < combinations.length; i++) {
            const config = combinations[i];
            
            // Update progress
            set({ progress: ((i + 1) / combinations.length) * 100 });
            
            // Run simulation with this config
            const simulationStore = useSimulationStore.getState();
            await simulationStore.runSimulation(`${permutation.name} - Run ${i + 1}`);
            
            // Check if we should stop
            if (!get().isRunning) break;
          }
          
          // Update status to completed
          set((state) => ({
            permutations: state.permutations.map(p => 
              p.id === id ? { ...p, status: 'completed' } : p
            ),
            isRunning: false,
            progress: 100,
          }));
          
        } catch (error) {
          set((state) => ({
            permutations: state.permutations.map(p => 
              p.id === id ? { ...p, status: 'failed' } : p
            ),
            isRunning: false,
            progress: 0,
          }));
          throw error;
        }
      },
      
      stopPermutation: () => set({ isRunning: false }),
      
      duplicatePermutation: (id) => {
        const permutation = get().permutations.find(p => p.id === id);
        if (permutation) {
          const duplicated: PermutationConfig = {
            ...permutation,
            id: `perm_${Date.now()}`,
            name: `${permutation.name} (Copy)`,
            createdAt: new Date(),
            status: 'pending',
            runs: [],
          };
          set((state) => ({ permutations: [duplicated, ...state.permutations] }));
        }
      },
      
      exportPermutation: (id) => {
        const permutation = get().permutations.find(p => p.id === id);
        if (permutation) {
          const dataStr = JSON.stringify(permutation, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${permutation.name.replace(/\s+/g, '_')}.json`;
          link.click();
          URL.revokeObjectURL(url);
        }
      },
      
      importPermutation: (data) => {
        try {
          const permutation: PermutationConfig = JSON.parse(data);
          permutation.id = `perm_${Date.now()}`;
          permutation.createdAt = new Date();
          permutation.status = 'pending';
          permutation.runs = [];
          set((state) => ({ permutations: [permutation, ...state.permutations] }));
        } catch (error) {
          throw new Error('Invalid permutation data format');
        }
      },
    }),
    {
      name: 'permutation-storage',
      partialize: (state) => ({
        permutations: state.permutations,
      }),
    }
  )
);

// Helper function to generate parameter combinations
function generateParameterCombinations(baseConfig: SimulationConfig, variations: any): SimulationConfig[] {
  const combinations: SimulationConfig[] = [];
  
  // Generate combinations for each parameter type
  const noiseCombos = variations.noise ? generatePermutations(baseConfig.noise, variations.noise) : [[baseConfig.noise]];
  const roundsCombos = variations.rounds ? generatePermutations(baseConfig.rounds, variations.rounds) : [[baseConfig.rounds]];
  const popSizeCombos = variations.populationSize ? generatePermutations(baseConfig.populationSize, variations.populationSize) : [[baseConfig.populationSize]];
  const genCombos = variations.generations ? generatePermutations(baseConfig.generations, variations.generations) : [[baseConfig.generations]];
  const evoRateCombos = variations.evolutionRate ? generatePermutations(baseConfig.evolutionRate, variations.evolutionRate) : [[baseConfig.evolutionRate]];
  const repCombos = variations.replications ? generatePermutations(baseConfig.replications, variations.replications) : [[baseConfig.replications]];
  
  // Generate all combinations
  for (const noise of noiseCombos) {
    for (const rounds of roundsCombos) {
      for (const popSize of popSizeCombos) {
        for (const gens of genCombos) {
          for (const evoRate of evoRateCombos) {
            for (const reps of repCombos) {
              combinations.push({
                ...baseConfig,
                noise: noise[0],
                rounds: rounds[0],
                populationSize: popSize[0],
                generations: gens[0],
                evolutionRate: evoRate[0],
                replications: reps[0],
              });
            }
          }
        }
      }
    }
  }
  
  return combinations;
}
