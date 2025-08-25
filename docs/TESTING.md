# Testing

Use Jest + React Testing Library. Prefer pure engine tests.

## Cases
- TFT symmetry (self vs self)
- Grim triggers on first D and never forgives
- Pavlov transitions (CC/DD stay, CD/DC switch)
- Deterministic Random/GenerousTFT under fixed seed
- Replicator conserves total population
- PD constraints enforced/warned
- No NaNs; populations non‑negative

## Example
```ts
it('tit‑for‑tat is symmetric vs itself', () => {
  const rng = mulberry32(123)
  const res = replicateAvg(tft, tft, 100, 0.02, matrix, 5, rng)
  expect(Math.abs(res.payA - res.payB)).toBeLessThan(1e-6)
})
```
