import {
  mulberry32,
  simulateMatch,
  replicateAvg,
  aggregatedTournament,
  evolvePopulationWeighted,
  clamp,
  defaultPayoffMatrix,
  validatePayoffMatrix,
  generatePermutations
} from '../gameLogic';
import { Strategy } from '../../types';

// Mock strategies for testing
const mockStrategy: Strategy = {
  id: 'test',
  name: 'Test Strategy',
  color: '#000000',
  getMove: (rng: () => number) => (history: any[]) => 'C'
};

const mockStrategyDefect: Strategy = {
  id: 'test-defect',
  name: 'Test Defect Strategy',
  color: '#000000',
  getMove: (rng: () => number) => (history: any[]) => 'D'
};

describe('Game Logic Utilities', () => {
  describe('mulberry32', () => {
    it('should generate consistent random numbers for same seed', () => {
      const rng1 = mulberry32(123);
      const rng2 = mulberry32(123);
      
      expect(rng1()).toBe(rng2());
      expect(rng1()).toBe(rng2());
    });

    it('should generate different numbers for different seeds', () => {
      const rng1 = mulberry32(123);
      const rng2 = mulberry32(456);
      
      expect(rng1()).not.toBe(rng2());
    });

    it('should generate numbers between 0 and 1', () => {
      const rng = mulberry32(123);
      
      for (let i = 0; i < 100; i++) {
        const num = rng();
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThan(1);
      }
    });
  });

  describe('simulateMatch', () => {
    it('should simulate a match between two strategies', () => {
      const rng = mulberry32(123);
      const result = simulateMatch(
        mockStrategy,
        mockStrategyDefect,
        10,
        0,
        defaultPayoffMatrix,
        rng
      );

      expect(result.scoreA).toBeGreaterThanOrEqual(0);
      expect(result.scoreB).toBeGreaterThanOrEqual(0);
      expect(result.coopA).toBeGreaterThanOrEqual(0);
      expect(result.coopB).toBeGreaterThanOrEqual(0);
      expect(result.rounds).toBe(10);
    });

    it('should handle noise correctly', () => {
      const rng = mulberry32(123);
      const result = simulateMatch(
        mockStrategy,
        mockStrategyDefect,
        100,
        0.1,
        defaultPayoffMatrix,
        rng
      );

      // With noise, we expect some variation from pure cooperation/defection
      expect(result.coopA).toBeGreaterThan(0);
      expect(result.coopA).toBeLessThan(100);
    });
  });

  describe('replicateAvg', () => {
    it('should calculate average payoffs across replications', () => {
      const rng = mulberry32(123);
      const result = replicateAvg(
        mockStrategy,
        mockStrategyDefect,
        10,
        0,
        defaultPayoffMatrix,
        5,
        rng
      );

      expect(result.payA).toBeGreaterThanOrEqual(0);
      expect(result.payB).toBeGreaterThanOrEqual(0);
      expect(result.coopRateA).toBeGreaterThanOrEqual(0);
      expect(result.coopRateB).toBeGreaterThanOrEqual(0);
    });
  });

  describe('aggregatedTournament', () => {
    it('should run a tournament between multiple strategies', () => {
      const strategies = [mockStrategy, mockStrategyDefect];
      const population = { 'test': 50, 'test-defect': 50 };
      const rng = mulberry32(123);

      const result = aggregatedTournament(
        strategies,
        population,
        10,
        0,
        defaultPayoffMatrix,
        3,
        rng
      );

      expect(result.avgPayoffs['test']).toBeGreaterThanOrEqual(0);
      expect(result.avgPayoffs['test-defect']).toBeGreaterThanOrEqual(0);
      expect(result.coopRates['test']).toBeGreaterThanOrEqual(0);
      expect(result.coopRates['test-defect']).toBeGreaterThanOrEqual(0);
    });
  });

  describe('evolvePopulationWeighted', () => {
    it('should evolve population based on performance', () => {
      const strategies = [mockStrategy, mockStrategyDefect];
      const population = { 'test': 50, 'test-defect': 50 };
      const rng = mulberry32(123);

      // First get the average payoffs from a tournament
      const tournamentResult = aggregatedTournament(
        strategies,
        population,
        10,
        0,
        defaultPayoffMatrix,
        3,
        rng
      );

      // Then evolve the population based on those payoffs
      const newPopulation = evolvePopulationWeighted(
        population,
        tournamentResult.avgPayoffs,
        0.1
      );

      expect(newPopulation['test']).toBeGreaterThanOrEqual(0);
      expect(newPopulation['test-defect']).toBeGreaterThanOrEqual(0);
      
      // Total population should remain the same
      const totalBefore = Object.values(population).reduce((a, b) => a + b, 0);
      const totalAfter = Object.values(newPopulation).reduce((a, b) => a + b, 0);
      expect(totalAfter).toBe(totalBefore);
    });
  });

  describe('clamp', () => {
    it('should clamp values to min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('defaultPayoffMatrix', () => {
    it('should have valid payoff values', () => {
      expect(defaultPayoffMatrix.T).toBe(5);
      expect(defaultPayoffMatrix.R).toBe(3);
      expect(defaultPayoffMatrix.P).toBe(1);
      expect(defaultPayoffMatrix.S).toBe(0);
    });
  });

  describe('validatePayoffMatrix', () => {
    it('should validate correct payoff matrices', () => {
      const validMatrix = { T: 5, R: 3, P: 1, S: 0 };
      expect(validatePayoffMatrix(validMatrix)).toBe(true);
    });

    it('should reject invalid payoff matrices', () => {
      const invalidMatrix = { T: 5, R: 3, P: 1 }; // Missing S
      expect(validatePayoffMatrix(invalidMatrix)).toBe(false);
    });
  });

  describe('generatePermutations', () => {
    it('should generate parameter combinations', () => {
      const baseConfig = {
        payoffMatrix: defaultPayoffMatrix,
        noise: 0.01,
        rounds: 100,
        populationSize: 1000,
        generations: 100,
        evolutionRate: 0.1,
        replications: 10,
        seed: 123456789,
        selectedStrategies: ['test']
      };

      const variations = {
        noise: [0.01, 0.05],
        populationSize: [100, 1000]
      };

      // Test with a simpler approach - just test the basic function
      const permutations = generatePermutations(0.01, [0.01, 0.05, 0.1]);

      expect(permutations.length).toBeGreaterThan(0);
      
      // Check that each permutation contains the base value
      permutations.forEach(perm => {
        expect(perm).toContain(0.01);
      });
    });
  });
});
