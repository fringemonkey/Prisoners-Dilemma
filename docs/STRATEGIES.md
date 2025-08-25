# Strategy API
A strategy decides `C` or `D` based on its own history. It receives a seeded RNG for determinism.

```ts
export type Strategy = {
  id: string
  name: string
  color: string
  getMove: (rng: () => number) => (history: History) => Move
}
```

## Built‑ins

* Always Cooperate
* Always Defect
* Tit‑for‑Tat
* Generous Tit‑for‑Tat (probabilistic forgiveness)
* Grim Trigger
* Pavlov (Win‑Stay, Lose‑Shift)
* Random

## Writing your own

```js
(history) => {
  // history: [{ self: 'C'|'D', opponent: 'C'|'D' }, ...]
  return 'C'
}
```

Tips:

* Use the RNG passed to `getMove(rng)` for any randomness.
* Keep IDs URL‑safe; avoid spaces.
