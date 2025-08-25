# Contributing

Thanks for your interest! Please:
1. Open an Issue describing the change.
2. Create a feature branch from `main` (one issue per branch/PR).
3. Keep PRs small; add tests.
4. Use conventional commits style when possible (e.g., `feat:`, `fix:`, `perf:`).

## Setup
- Node 18+
- pnpm/yarn/npm

## Development
```bash
npm install
npm start
```

## Tests

```bash
npm test
```

## Code areas

* `/src/engine` — pure simulation logic
* `/src/ui` — React components
* `/src/worker` — Web Worker wrapper

## Reporting bugs

Include steps to reproduce, expected vs actual, screenshots, and your commit hash.
