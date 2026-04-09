// Grid Battle constants and types used by the page component
// and (future) algorithm implementations.

/** Number of rows and columns in the battle grid. */
export const GRID_SIZE = 30;

/** Tailwind color classes for each player, indexed by PlayerId. */
export const PLAYER_COLORS = [
  "bg-sky-500",     // Player 0 — top-left
  "bg-rose-500",    // Player 1 — top-right
  "bg-amber-500",   // Player 2 — bottom-left
  "bg-emerald-500", // Player 3 — bottom-right
] as const;

export type PlayerId = 0 | 1 | 2 | 3;

/** A single cell on the battle grid. */
export interface Cell {
  owner: PlayerId | null;
  isWall: boolean;
}
