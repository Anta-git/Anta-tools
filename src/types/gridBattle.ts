export const GRID_SIZE = 30;

export const PLAYER_COLORS = [
  "bg-sky-500",    // top-left
  "bg-rose-500",   // top-right
  "bg-amber-500",  // bottom-left
  "bg-emerald-500", // bottom-right
] as const;

export type PlayerId = 0 | 1 | 2 | 3;

export interface Cell {
  owner: PlayerId | null;
  isWall: boolean;
}
