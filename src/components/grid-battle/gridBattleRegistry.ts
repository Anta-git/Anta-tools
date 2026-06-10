/**
 * Grid Battle algorithm registry.
 *
 * Same pattern as the sorting registry — each entry pairs a strategy
 * function with display metadata. A strategy decides which unclaimed
 * cell its player should claim next, given the player's frontier
 * (owned cells that may still have open neighbors).
 *
 * Strategies are allowed to reorder or prune the frontier in place —
 * that's how BFS (queue) and DFS (stack) get their distinct shapes.
 */
import type { Cell } from "../../types/gridBattle";

/** A grid coordinate as [row, col]. */
export type Coord = [row: number, col: number];

/** 4-directional neighbors of a coordinate that are inside the grid. */
function neighborsOf([row, col]: Coord, size: number): Coord[] {
  const result: Coord[] = [];
  if (row > 0) result.push([row - 1, col]);
  if (row < size - 1) result.push([row + 1, col]);
  if (col > 0) result.push([row, col - 1]);
  if (col < size - 1) result.push([row, col + 1]);
  return result;
}

/** A cell can be claimed if it's unowned and not a wall. */
function isClaimable(grid: Cell[][], [row, col]: Coord): boolean {
  const cell = grid[row][col];
  return cell.owner === null && !cell.isWall;
}

/** All claimable neighbors of a coordinate. */
function claimableNeighbors(grid: Cell[][], coord: Coord): Coord[] {
  return neighborsOf(coord, grid.length).filter((n) => isClaimable(grid, n));
}

export interface GridBattleAlgorithm {
  label: string;
  description: string;
  /**
   * Choose the next cell to claim, or null when the player is boxed in.
   * May mutate `frontier` (reorder/prune exhausted cells).
   */
  pickClaim: (frontier: Coord[], grid: Cell[][]) => Coord | null;
}

export const gridBattleRegistry = {
  bfs: {
    label: "BFS",
    description: "Expands evenly outward, like a flood fill (frontier as a queue).",
    pickClaim: (frontier, grid) => {
      // Always expand from the oldest frontier cell first.
      while (frontier.length > 0) {
        const open = claimableNeighbors(grid, frontier[0]);
        if (open.length === 0) {
          frontier.shift(); // exhausted — dequeue and move on
          continue;
        }
        return open[0];
      }
      return null;
    },
  },
  dfs: {
    label: "DFS",
    description: "Snakes deep into open space before backtracking (frontier as a stack).",
    pickClaim: (frontier, grid) => {
      // Always expand from the most recently claimed cell first.
      while (frontier.length > 0) {
        const open = claimableNeighbors(grid, frontier[frontier.length - 1]);
        if (open.length === 0) {
          frontier.pop(); // dead end — backtrack
          continue;
        }
        return open[0];
      }
      return null;
    },
  },
  random: {
    label: "Random Walk",
    description: "Expands from a random frontier cell in a random direction.",
    pickClaim: (frontier, grid) => {
      while (frontier.length > 0) {
        const idx = Math.floor(Math.random() * frontier.length);
        const open = claimableNeighbors(grid, frontier[idx]);
        if (open.length === 0) {
          frontier.splice(idx, 1); // exhausted — prune it
          continue;
        }
        return open[Math.floor(Math.random() * open.length)];
      }
      return null;
    },
  },
  greedy: {
    label: "Greedy",
    description: "Claims whichever reachable cell opens up the most new territory.",
    pickClaim: (frontier, grid) => {
      let best: Coord | null = null;
      let bestScore = -1;
      // Walk backwards so exhausted frontier cells can be pruned in place.
      for (let i = frontier.length - 1; i >= 0; i--) {
        const open = claimableNeighbors(grid, frontier[i]);
        if (open.length === 0) {
          frontier.splice(i, 1);
          continue;
        }
        for (const candidate of open) {
          const score = claimableNeighbors(grid, candidate).length;
          if (score > bestScore) {
            bestScore = score;
            best = candidate;
          }
        }
      }
      return best;
    },
  },
} as const satisfies Record<string, GridBattleAlgorithm>;

export type GridBattleAlgorithmKey = keyof typeof gridBattleRegistry;

/** Which algorithm each player (by PlayerId / corner) runs. */
export const PLAYER_ALGORITHMS = [
  "bfs",
  "dfs",
  "random",
  "greedy",
] as const satisfies readonly GridBattleAlgorithmKey[];
