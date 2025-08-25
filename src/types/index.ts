// Core game types
export interface PayoffMatrix {
  T: number; // Temptation
  R: number; // Reward
  P: number; // Punishment
  S: number; // Sucker's payoff
}

export interface Strategy {
  id: string;
  name: string;
  author?: string;
  color: string;
  rating?: number;
  downloads?: number;
  getMove: (rng: () => number) => (history: GameHistory) => 'C' | 'D';
}

export interface GameHistory {
  self: 'C' | 'D';
  opponent: 'C' | 'D';
}

export interface SimulationResult {
  generation: number;
  [strategyId: string]: number;
}

export interface CooperationData {
  generation: number;
  [strategyId: string]: number;
}

export interface PopulationData {
  generation: number;
  [strategyId: string]: number;
}

export interface HeadToHeadMatrix {
  [rowStrategyId: string]: {
    [colStrategyId: string]: number;
  };
}

export interface SimulationConfig {
  payoffMatrix: PayoffMatrix;
  noise: number;
  rounds: number;
  populationSize: number;
  generations: number;
  evolutionRate: number;
  replications: number;
  seed: number;
  selectedStrategies: string[];
}

export interface SimulationRun {
  id: string;
  name: string;
  config: SimulationConfig;
  results: SimulationResult[];
  cooperationData: CooperationData[];
  populationData: PopulationData[];
  headToHeadMatrix: HeadToHeadMatrix;
  leaderboard: Array<{ name: string; id: string; count: number }>;
  timestamp: Date;
  duration: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
}

export interface PermutationConfig {
  id: string;
  name: string;
  baseConfig: SimulationConfig;
  variations: {
    payoffMatrix?: Partial<PayoffMatrix>;
    noise?: number[];
    rounds?: number[];
    populationSize?: number[];
    generations?: number[];
    evolutionRate?: number[];
    replications?: number[];
    strategies?: string[][];
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  runs: SimulationRun[];
  createdAt: Date;
}

// UI State types
export interface UIState {
  highContrast: boolean;
  uiScale: number;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  activeTab: string;
  splitView: boolean;
  selectedRuns: string[];
}

// Chart types
export interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'scatter';
  dataKey: string;
  stroke?: string;
  fill?: string;
  name?: string;
}

// Export/Import types
export interface ExportData {
  version: string;
  timestamp: Date;
  runs: SimulationRun[];
  permutations: PermutationConfig[];
  strategies: Strategy[];
}
