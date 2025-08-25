import {
  defaultStrategies,
  communityStrategies,
  allStrategies,
  COLORS,
  createCustomStrategy,
  validateStrategy,
  compareStrategies
} from '../strategies';
import { Strategy } from '../../types';

describe('Strategies Utilities', () => {
  describe('defaultStrategies', () => {
    it('should contain all required built-in strategies', () => {
      const strategyIds = defaultStrategies.map(s => s.id);
      
      expect(strategyIds).toContain('alwaysCooperate');
      expect(strategyIds).toContain('alwaysDefect');
      expect(strategyIds).toContain('titForTat');
      expect(strategyIds).toContain('generousTFT');
      expect(strategyIds).toContain('grimTrigger');
      expect(strategyIds).toContain('pavlov');
      expect(strategyIds).toContain('random');
    });

    it('should have valid strategy objects', () => {
      defaultStrategies.forEach(strategy => {
        expect(strategy).toHaveProperty('id');
        expect(strategy).toHaveProperty('name');
        expect(strategy).toHaveProperty('color');
        expect(strategy).toHaveProperty('getMove');
        expect(typeof strategy.getMove).toBe('function');
      });
    });
  });

  describe('communityStrategies', () => {
    it('should contain community strategies', () => {
      const strategyIds = communityStrategies.map(s => s.id);
      
      expect(strategyIds).toContain('copycat');
      expect(strategyIds).toContain('forgiving');
      expect(strategyIds).toContain('opportunist');
      expect(strategyIds).toContain('adaptive');
      expect(strategyIds).toContain('gradual');
    });

    it('should have ratings and download counts', () => {
      communityStrategies.forEach(strategy => {
        expect(strategy).toHaveProperty('rating');
        expect(strategy).toHaveProperty('downloads');
        expect(typeof strategy.rating).toBe('number');
        expect(typeof strategy.downloads).toBe('number');
      });
    });
  });

  describe('allStrategies', () => {
    it('should combine default and community strategies', () => {
      expect(allStrategies).toHaveLength(defaultStrategies.length + communityStrategies.length);
    });

    it('should have unique IDs', () => {
      const ids = allStrategies.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('COLORS', () => {
    it('should contain valid color values', () => {
      Object.values(COLORS).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('createCustomStrategy', () => {
    it('should create a valid strategy from code', () => {
      const code = '(history) => history.length > 0 ? history[history.length - 1].opponent : "C"';
      const strategy = createCustomStrategy('Test Strategy', code, 'Test Author');

      expect(strategy.id).toBe('teststrategy');
      expect(strategy.name).toBe('Test Strategy');
      expect(strategy.author).toBe('Test Author');
      expect(strategy.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(strategy.rating).toBe(0);
      expect(strategy.downloads).toBe(0);
      expect(typeof strategy.getMove).toBe('function');
    });

    it('should generate unique IDs for different names', () => {
      const strategy1 = createCustomStrategy('Strategy One', '() => "C"');
      const strategy2 = createCustomStrategy('Strategy Two', '() => "D"');
      
      expect(strategy1.id).not.toBe(strategy2.id);
    });

    it('should throw error for invalid code', () => {
      expect(() => {
        createCustomStrategy('Invalid', 'invalid javascript code');
      }).toThrow('Invalid strategy code');
    });
  });

  describe('validateStrategy', () => {
    it('should validate working strategies', () => {
      const validStrategy: Strategy = {
        id: 'test',
        name: 'Test',
        color: '#000000',
        getMove: () => () => 'C'
      };
      
      expect(validateStrategy(validStrategy)).toBe(true);
    });

    it('should reject strategies that throw errors', () => {
      const invalidStrategy: Strategy = {
        id: 'test',
        name: 'Test',
        color: '#000000',
        getMove: () => () => {
          throw new Error('Strategy error');
        }
      };
      
      expect(validateStrategy(invalidStrategy)).toBe(false);
    });

    it('should reject strategies that return invalid moves', () => {
      const invalidStrategy: Strategy = {
        id: 'test',
        name: 'Test',
        color: '#000000',
        getMove: () => () => 'X' as any
      };
      
      expect(validateStrategy(invalidStrategy)).toBe(false);
    });
  });

  describe('compareStrategies', () => {
    it('should compare two strategies and return similarity metrics', () => {
      const strategy1: Strategy = {
        id: 'cooperate',
        name: 'Always Cooperate',
        color: '#000000',
        getMove: () => () => 'C'
      };
      
      const strategy2: Strategy = {
        id: 'defect',
        name: 'Always Defect',
        color: '#000000',
        getMove: () => () => 'D'
      };

      const comparison = compareStrategies(strategy1, strategy2);
      
      expect(comparison).toHaveProperty('similarity');
      expect(comparison).toHaveProperty('differences');
      expect(typeof comparison.similarity).toBe('number');
      expect(Array.isArray(comparison.differences)).toBe(true);
    });

    it('should identify differences between strategies', () => {
      const strategy1: Strategy = {
        id: 'cooperate',
        name: 'Always Cooperate',
        color: '#000000',
        getMove: () => () => 'C'
      };
      
      const strategy2: Strategy = {
        id: 'defect',
        name: 'Always Defect',
        color: '#000000',
        getMove: () => () => 'D'
      };

      const comparison = compareStrategies(strategy1, strategy2);
      
      expect(comparison.differences).toContain('Name');
      expect(comparison.similarity).toBeLessThan(1); // Should be different
    });

    it('should handle identical strategies', () => {
      const strategy1: Strategy = {
        id: 'cooperate',
        name: 'Always Cooperate',
        color: '#000000',
        getMove: () => () => 'C'
      };
      
      const strategy2: Strategy = {
        id: 'cooperate2',
        name: 'Always Cooperate Too', // Different name
        color: '#000000',
        getMove: () => () => 'C'
      };

      const comparison = compareStrategies(strategy1, strategy2);
      
      expect(comparison.differences).toContain('Name'); // Different names
      expect(comparison.similarity).toBeGreaterThan(0.5); // Should be similar
    });
  });

  describe('Strategy Behavior Tests', () => {
    it('should test always cooperate strategy', () => {
      const strategy = defaultStrategies.find(s => s.id === 'alwaysCooperate')!;
      const moveGetter = strategy.getMove(() => 0.5);
      
      // Should always cooperate regardless of history
      expect(moveGetter([])).toBe('C');
      expect(moveGetter([{ self: 'D', opponent: 'C' }])).toBe('C');
      expect(moveGetter([{ self: 'C', opponent: 'D' }])).toBe('C');
    });

    it('should test always defect strategy', () => {
      const strategy = defaultStrategies.find(s => s.id === 'alwaysDefect')!;
      const moveGetter = strategy.getMove(() => 0.5);
      
      // Should always defect regardless of history
      expect(moveGetter([])).toBe('D');
      expect(moveGetter([{ self: 'D', opponent: 'C' }])).toBe('D');
      expect(moveGetter([{ self: 'C', opponent: 'D' }])).toBe('D');
    });

    it('should test tit for tat strategy', () => {
      const strategy = defaultStrategies.find(s => s.id === 'titForTat')!;
      const moveGetter = strategy.getMove(() => 0.5);
      
      // Should start with cooperation
      expect(moveGetter([])).toBe('C');
      // Should copy opponent's last move
      expect(moveGetter([{ self: 'C', opponent: 'C' }])).toBe('C');
      expect(moveGetter([{ self: 'C', opponent: 'D' }])).toBe('D');
    });
  });
});
