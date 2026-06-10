# Anta-tools

Personal project hub — a portfolio of small interactive web tools, visualizations, and game experiments.

**Live features:**

- **Sorting Visuals** — step-by-step sorting algorithm visualizer (Bubble Sort, Heap Sort) with audio feedback, adjustable speed/size, and a generator-based engine that keeps algorithm logic React-free
- **Grid Battle** — four pathfinding-style strategies (BFS, DFS, Random Walk, Greedy) compete to claim territory on a walled grid
- **Missouri Weather** — live current conditions via the [Open-Meteo API](https://open-meteo.com/)
- **Horror Game Concept** — UI mockup for a horror idle game

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Deployed on Cloudflare Workers (custom domain)

## Development

```bash
npm install
npm run dev      # local dev server
npm run lint     # eslint (type-checked rules)
npm run build    # type-check + production build
npm run preview  # build + serve via wrangler
npm run deploy   # build + deploy to Cloudflare
```

## Project structure

```
src/
  components/   # shared UI + algorithm engines (sorting, grid-battle)
  hooks/        # stateful logic consumed by pages (useSorting, useGridBattle)
  pages/        # one component per route (apps/, games/)
  types/        # shared types and constants
  utils/        # helpers (Web Audio tone synthesis)
```

The visualizers follow a common pattern: pure generator functions produce step-by-step snapshots, a custom hook consumes them on a timer, and the page component stays purely presentational.
