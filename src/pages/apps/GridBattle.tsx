import { useState, useCallback } from "react";
import { GRID_SIZE, PLAYER_COLORS } from "../../types/gridBattle";
import type { Cell, PlayerId } from "../../types/gridBattle";

function createGrid(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ owner: null, isWall: false }))
  );

  // Place each player in a corner
  const corners: [number, number][] = [
    [0, 0],
    [0, GRID_SIZE - 1],
    [GRID_SIZE - 1, 0],
    [GRID_SIZE - 1, GRID_SIZE - 1],
  ];

  corners.forEach(([row, col], i) => {
    grid[row][col].owner = i as PlayerId;
  });

  return grid;
}

function cellColor(cell: Cell): string {
  if (cell.isWall) return "bg-zinc-700";
  if (cell.owner !== null) return PLAYER_COLORS[cell.owner];
  return "bg-zinc-900";
}

export default function GridBattle() {
  const [grid, setGrid] = useState(createGrid);

  const resetGrid = useCallback(() => {
    setGrid(createGrid());
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">Grid Battle</h1>
      <p className="text-zinc-400 mb-10">
        Four algorithms compete to claim the most territory on a grid.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-10 items-center">
        <button
          onClick={resetGrid}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Grid */}
      <div
        className="inline-grid gap-px bg-zinc-800 border border-zinc-700 rounded-lg p-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE.toString()}, 1fr)`,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r.toString()}-${c.toString()}`}
              className={`w-3 h-3 rounded-sm ${cellColor(cell)}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
