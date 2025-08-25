import { Strategy, GameHistory } from '../types';

// Colorblind-safe palette (Okabe–Ito)
export const COLORS = {
  ORANGE: "#E69F00",
  SKY: "#56B4E9",
  GREEN: "#009E73",
  YELLOW: "#F0E442",
  BLUE: "#0072B2",
  VERMIL: "#D55E00",
  PURPLE: "#CC79A7",
  RED: "#FF6B6B",
  TEAL: "#4ECDC4",
  CYAN: "#45B7D1",
  PINK: "#FF69B4",
  LIME: "#32CD32"
};

// Built-in strategies
export const defaultStrategies: Strategy[] = [
  {
    id: "alwaysCooperate",
    name: "Always Cooperate",
    getMove: () => () => "C",
    color: COLORS.SKY
  },
  {
    id: "alwaysDefect",
    name: "Always Defect",
    getMove: () => () => "D",
    color: COLORS.VERMIL
  },
  {
    id: "titForTat",
    name: "Tit for Tat",
    getMove: () => (h) => (!h || h.length === 0 ? "C" : h[h.length - 1].opponent),
    color: COLORS.BLUE
  },
  {
    id: "generousTFT",
    name: "Generous TFT (10% forgiveness)",
    getMove: (rng) => (h) => {
      if (!h || h.length === 0) return "C";
      const o = h[h.length - 1].opponent;
      return o === "D" && rng() < 0.1 ? "C" : o;
    },
    color: COLORS.GREEN
  },
  {
    id: "grimTrigger",
    name: "Grim Trigger",
    getMove: () => (h) => {
      const d = h && h.some((x) => x.opponent === "D");
      return d ? "D" : "C";
    },
    color: COLORS.ORANGE
  },
  {
    id: "pavlov",
    name: "Pavlov (Win-Stay-Lose-Shift)",
    getMove: () => (h) => {
      if (!h || h.length === 0) return "C";
      const last = h[h.length - 1];
      const mc = last.self === "C" && last.opponent === "C";
      const md = last.self === "D" && last.opponent === "D";
      return mc || md ? last.self : last.self === "C" ? "D" : "C";
    },
    color: COLORS.PURPLE
  },
  {
    id: "random",
    name: "Random",
    getMove: (rng) => () => (rng() < 0.5 ? "C" : "D"),
    color: COLORS.YELLOW
  }
];

// Community strategies
export const communityStrategies: Strategy[] = [
  {
    id: "copycat",
    name: "Copycat",
    author: "Community",
    getMove: () => (h) => (!h || h.length === 0 ? "C" : h[h.length - 1].opponent),
    color: COLORS.RED,
    rating: 4.2,
    downloads: 156
  },
  {
    id: "forgiving",
    name: "Forgiving",
    author: "Community",
    getMove: () => (h) => (!h || h.length === 0 ? "C" : h.some(x => x.opponent === "D") ? "D" : "C"),
    color: COLORS.TEAL,
    rating: 4.2,
    downloads: 89
  },
  {
    id: "opportunist",
    name: "Opportunist",
    author: "Community",
    getMove: () => (h) => (!h || h.length === 0 ? "C" : h.length < 3 ? "C" : "D"),
    color: COLORS.CYAN,
    rating: 3.5,
    downloads: 67
  },
  {
    id: "adaptive",
    name: "Adaptive",
    author: "Community",
    getMove: () => (h) => {
      if (!h || h.length === 0) return "C";
      const recent = h.slice(-5);
      const coopRate = recent.filter(x => x.opponent === "C").length / recent.length;
      return coopRate > 0.6 ? "C" : "D";
    },
    color: COLORS.PINK,
    rating: 4.0,
    downloads: 123
  },
  {
    id: "gradual",
    name: "Gradual",
    author: "Community",
    getMove: () => (h) => {
      if (!h || h.length === 0) return "C";
      if (h.length === 1) return "C";
      if (h.length === 2) return "D";
      if (h.length === 3) return "C";
      if (h.length === 4) return "C";
      if (h.length === 5) return "C";
      if (h.length === 6) return "D";
      if (h.length === 7) return "D";
      if (h.length === 8) return "C";
      if (h.length === 9) return "D";
      if (h.length === 10) return "D";
      if (h.length === 11) return "C";
      return "C";
    },
    color: COLORS.LIME,
    rating: 3.8,
    downloads: 45
  }
];

// All available strategies
export const allStrategies = [...defaultStrategies, ...communityStrategies];

// Strategy factory for custom strategies
export function createCustomStrategy(
  name: string,
  code: string,
  author: string = "Custom"
): Strategy {
  try {
    // eslint-disable-next-line no-new-func
    const func = new Function("history", `return (${code})(history);`) as (history: GameHistory[]) => 'C' | 'D';
    
    return {
      id: name.replace(/\s+/g, "").toLowerCase(),
      name,
      author,
      getMove: (rng: () => number) => func,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      rating: 0,
      downloads: 0
    };
  } catch (error) {
    throw new Error(`Invalid strategy code: ${error}`);
  }
}

// Strategy validation
export function validateStrategy(strategy: Strategy): boolean {
  try {
    const testHistory = [
      { self: "C" as const, opponent: "C" as const },
      { self: "D" as const, opponent: "C" as const }
    ];
    
    const moveGetter = strategy.getMove(() => 0.5);
    const move1 = moveGetter([]);
    const move2 = moveGetter(testHistory);
    
    return move1 === "C" || move1 === "D" || move2 === "C" || move2 === "D";
  } catch {
    return false;
  }
}

// Strategy comparison
export function compareStrategies(strategyA: Strategy, strategyB: Strategy): {
  similarity: number;
  differences: string[];
} {
  const differences: string[] = [];
  let similarity = 0;
  
  // Compare basic properties
  if (strategyA.name !== strategyB.name) differences.push("Name");
  if (strategyA.color !== strategyB.color) differences.push("Color");
  if (strategyA.author !== strategyB.author) differences.push("Author");
  
  // Test with sample histories
  const testHistories = [
    [],
    [{ self: "C" as const, opponent: "C" as const }],
    [{ self: "D" as const, opponent: "C" as const }],
    [{ self: "C" as const, opponent: "D" as const }]
  ];
  
  let matchingMoves = 0;
  const totalMoves = testHistories.length;
  
  testHistories.forEach(history => {
    try {
      const moveA = strategyA.getMove(() => 0.5)(history);
      const moveB = strategyB.getMove(() => 0.5)(history);
      if (moveA === moveB) matchingMoves++;
    } catch {
      // If either strategy fails, count as different
    }
  });
  
  similarity = matchingMoves / totalMoves;
  
  return { similarity, differences };
}
