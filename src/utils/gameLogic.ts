import { PayoffMatrix, Strategy, GameHistory } from '@/types';

// ---------- RNG (seeded) ----------
export function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- Core Simulation (seeded) ----------
export function simulateMatch(
  strategyA: Strategy,
  strategyB: Strategy,
  rounds: number,
  noise: number,
  payoffMatrix: PayoffMatrix,
  rng: () => number
) {
  let historyA: GameHistory[] = [];
  let historyB: GameHistory[] = [];
  let scoreA = 0, scoreB = 0, coopA = 0, coopB = 0;
  
  const moveAGetter = strategyA.getMove(rng);
  const moveBGetter = strategyB.getMove(rng);
  
  for (let i = 0; i < rounds; i++) {
    let moveA = moveAGetter(historyA);
    let moveB = moveBGetter(historyB);
    
    // Apply noise
    if (rng() < noise) moveA = moveA === "C" ? "D" : "C";
    if (rng() < noise) moveB = moveB === "C" ? "D" : "C";
    
    if (moveA === "C") coopA++;
    if (moveB === "C") coopB++;
    
    // Calculate payoffs
    if (moveA === "C" && moveB === "C") {
      scoreA += payoffMatrix.R;
      scoreB += payoffMatrix.R;
    } else if (moveA === "C" && moveB === "D") {
      scoreA += payoffMatrix.S;
      scoreB += payoffMatrix.T;
    } else if (moveA === "D" && moveB === "C") {
      scoreA += payoffMatrix.T;
      scoreB += payoffMatrix.S;
    } else {
      scoreA += payoffMatrix.P;
      scoreB += payoffMatrix.P;
    }
    
    historyA.push({ self: moveA, opponent: moveB });
    historyB.push({ self: moveB, opponent: moveA });
  }
  
  return { scoreA, scoreB, coopA, coopB, rounds };
}

export function replicateAvg(
  strategyA: Strategy,
  strategyB: Strategy,
  rounds: number,
  noise: number,
  payoffMatrix: PayoffMatrix,
  replications: number,
  rng: () => number
) {
  let sumScoreA = 0, sumScoreB = 0, sumCoopA = 0, sumCoopB = 0, sumRounds = 0;
  
  for (let r = 0; r < replications; r++) {
    const res = simulateMatch(strategyA, strategyB, rounds, noise, payoffMatrix, rng);
    sumScoreA += res.scoreA;
    sumScoreB += res.scoreB;
    sumCoopA += res.coopA;
    sumCoopB += res.coopB;
    sumRounds += res.rounds;
  }
  
  return {
    payA: sumRounds ? sumScoreA / sumRounds : 0,
    payB: sumRounds ? sumScoreB / sumRounds : 0,
    coopRateA: sumRounds ? sumCoopA / sumRounds : 0,
    coopRateB: sumRounds ? sumCoopB / sumRounds : 0,
  };
}

export function aggregatedTournament(
  strategies: Strategy[],
  population: Record<string, number>,
  rounds: number,
  noise: number,
  payoffMatrix: PayoffMatrix,
  replications: number,
  rng: () => number
) {
  const ids = strategies.map((s) => s.id);
  const N = Object.values(population).reduce((a, b) => a + b, 0);
  const resultPay: Record<string, number> = {};
  const resultCoop: Record<string, number> = {};
  
  ids.forEach((id) => {
    resultPay[id] = 0;
    resultCoop[id] = 0;
  });
  
  const pairPay: Record<string, { a: number; b: number }> = {};
  const pairCoop: Record<string, { a: number; b: number }> = {};
  
  for (let i = 0; i < strategies.length; i++) {
    for (let j = 0; j < strategies.length; j++) {
      const key = `${strategies[i].id}__${strategies[j].id}`;
      const { payA, payB, coopRateA, coopRateB } = replicateAvg(
        strategies[i], strategies[j], rounds, noise, payoffMatrix, replications, rng
      );
      pairPay[key] = { a: payA, b: payB };
      pairCoop[key] = { a: coopRateA, b: coopRateB };
    }
  }
  
  ids.forEach((i) => {
    const n_i = population[i] || 0;
    let expectedPay = 0;
    let expectedCoop = 0;
    
    ids.forEach((j) => {
      const n_j = population[j] || 0;
      if (N <= 1) return;
      
      const oppShare = j === i 
        ? Math.max(0, n_i - 1) / Math.max(1, N - 1) 
        : n_j / Math.max(1, N - 1);
      
      const { a } = pairPay[`${i}__${j}`];
      const { a: coopA } = pairCoop[`${i}__${j}`];
      
      expectedPay += oppShare * a;
      expectedCoop += oppShare * coopA;
    });
    
    resultPay[i] = expectedPay;
    resultCoop[i] = expectedCoop;
  });
  
  return { avgPayoffs: resultPay, coopRates: resultCoop };
}

export function evolvePopulationWeighted(
  population: Record<string, number>,
  avgPayoffs: Record<string, number>,
  evolutionRate: number
): Record<string, number> {
  const ids = Object.keys(population);
  const N = ids.reduce((acc, id) => acc + population[id], 0) || 1;
  const meanPayoff = ids.reduce((acc, id) => acc + (avgPayoffs[id] || 0) * population[id], 0) / N;
  
  const next: Record<string, number> = {};
  let total = 0;
  
  ids.forEach((id) => {
    const oldCount = population[id];
    const payoff = avgPayoffs[id] || 0;
    let newCount = oldCount + evolutionRate * (payoff - meanPayoff) * oldCount;
    newCount = Math.max(0, newCount);
    next[id] = newCount;
    total += newCount;
  });
  
  const rounded: Record<string, number> = {};
  ids.forEach((id) => {
    rounded[id] = total > 0 ? Math.round((next[id] / total) * N) : 0;
  });
  
  const sumRounded = ids.reduce((a, id) => a + rounded[id], 0);
  if (sumRounded === 0) {
    const maxId = ids.reduce((best, id) => (next[id] > (next[best] || 0) ? id : best), ids[0]);
    rounded[maxId] = 1;
  }
  
  return rounded;
}

// Utility functions
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const defaultPayoffMatrix: PayoffMatrix = { T: 5, R: 3, P: 1, S: 0 };

// Validation functions
export function validatePayoffMatrix(matrix: PayoffMatrix): boolean {
  return matrix.T > matrix.R && 
         matrix.R > matrix.P && 
         matrix.P > matrix.S && 
         (2 * matrix.R) > (matrix.T + matrix.S);
}

export function generatePermutations<T>(
  baseValue: T,
  variations: T[],
  maxCombinations: number = 1000
): T[][] {
  if (variations.length === 0) return [[baseValue]];
  
  const results: T[][] = [];
  const stack: { values: T[]; index: number }[] = [{ values: [baseValue], index: 0 }];
  
  while (stack.length > 0 && results.length < maxCombinations) {
    const { values, index } = stack.pop()!;
    
    if (index >= variations.length) {
      results.push([...values]);
      continue;
    }
    
    for (const variation of variations) {
      stack.push({ values: [...values, variation], index: index + 1 });
    }
  }
  
  return results;
}
