/**
 * Grid Battle simulation engine.
 *
 * Completely React-agnostic, mirroring the sorting generators: the
 * battle runs as a generator that yields one BattleStep per round,
 * and the consuming hook renders steps at whatever pace it chooses.
 *
 * Each round, every player (in fixed order) asks its strategy for one
 * cell to claim. The battle ends when no player can expand any further.
 */
import { GRID_SIZE, WALL_DENSITY } from "../../types/gridBattle";
import type { Cell, PlayerId } from "../../types/gridBattle";
import { gridBattleRegistry, PLAYER_ALGORITHMS } from "./gridBattleRegistry";
import type { Coord } from "./gridBattleRegistry";

/** One animation frame: a full grid snapshot plus per-player cell counts. */
export interface BattleStep {
  grid: Cell[][];
  scores: number[];
}

const PLAYERS = [0, 1, 2, 3] as const;

/** Starting corner for each player, indexed by PlayerId. */
const CORNERS: readonly Coord[] = [
  [0, 0],                         // Player 0 — top-left
  [0, GRID_SIZE - 1],             // Player 1 — top-right
  [GRID_SIZE - 1, 0],             // Player 2 — bottom-left
  [GRID_SIZE - 1, GRID_SIZE - 1], // Player 3 — bottom-right
];

/**
 * Build a fresh grid: scattered walls for the algorithms to route
 * around, with each player placed in its corner. The corners and their
 * immediate neighbors are always kept wall-free so nobody starts boxed in.
 */
export function createGrid(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, (): Cell => ({
      owner: null,
      isWall: Math.random() < WALL_DENSITY,
    }))
  );

  CORNERS.forEach(([row, col], i) => {
    // Clear a small safe zone around the corner...
    for (let r = Math.max(0, row - 1); r <= Math.min(GRID_SIZE - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(GRID_SIZE - 1, col + 1); c++) {
        grid[r][c].isWall = false;
      }
    }
    // ...then drop the player in.
    grid[row][col].owner = i as PlayerId;
  });

  return grid;
}

/** Count cells owned by each player. */
function countScores(grid: Cell[][]): number[] {
  const scores = [0, 0, 0, 0];
  for (const row of grid) {
    for (const cell of row) {
      if (cell.owner !== null) scores[cell.owner]++;
    }
  }
  return scores;
}

/** Deep-clone the grid so yielded snapshots are immutable to the consumer. */
function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

/**
 * Run the battle from the given starting grid, yielding one step per
 * round (each round = every player attempts one claim).
 */
export function* battleSteps(initialGrid: Cell[][]): Generator<BattleStep> {
  const grid = cloneGrid(initialGrid); // work on a copy — never mutate the caller's grid
  const scores = countScores(grid);

  // Each player's frontier starts as the cells it already owns.
  const frontiers: Coord[][] = [[], [], [], []];
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell.owner !== null) frontiers[cell.owner].push([r, c]);
    });
  });

  let anyClaimed = true;
  while (anyClaimed) {
    anyClaimed = false;

    for (const player of PLAYERS) {
      const { pickClaim } = gridBattleRegistry[PLAYER_ALGORITHMS[player]];
      const claim = pickClaim(frontiers[player], grid);
      if (claim === null) continue; // boxed in — sits out the rest of the battle

      const [row, col] = claim;
      grid[row][col].owner = player;
      frontiers[player].push(claim);
      scores[player]++;
      anyClaimed = true;
    }

    if (anyClaimed) {
      yield { grid: cloneGrid(grid), scores: [...scores] };
    }
  }
}
