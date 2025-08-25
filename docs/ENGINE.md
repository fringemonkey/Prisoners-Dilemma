# Engine
Pure TypeScript module with no React/DOM dependencies.

## Modules
- `rng.ts` — mulberry32, seeding helpers
- `strategies.ts` — Strategy type and built‑ins; `getMove(rng) => (history) => 'C'|'D'`
- `match.ts` — `simulateMatch(strategyA, strategyB, rounds, noise, matrix, rng)`
- `tournament.ts` — aggregated tournament + permutations
- `evolve.ts` — replicator dynamics
- `metrics.ts` — summaries (winner, cooperation, entropy)

## Types
```ts
export type Move = 'C' | 'D'
export type Round = { self: Move; opponent: Move }
export type History = Round[]
export type Strategy = {
  id: string
  name: string
  color: string
  getMove: (rng: () => number) => (history: History) => Move
}
```

## Determinism

All random paths must use the provided RNG; never call `Math.random()` inside the engine.
