/**
 * Grid Battle page — a territory-claiming visualization where four
 * algorithms (BFS, DFS, Random Walk, Greedy) expand from their corners
 * and compete to own the most cells.
 *
 * Purely presentational — all simulation state and logic live in the
 * useGridBattle hook and the gridBattleEngine generator.
 */
import { useGridBattle } from "../../hooks/useGridBattle";
import { GRID_SIZE, PLAYER_COLORS } from "../../types/gridBattle";
import type { Cell } from "../../types/gridBattle";
import {
  gridBattleRegistry,
  PLAYER_ALGORITHMS,
} from "../../components/grid-battle/gridBattleRegistry";

/** Map a cell's state to its Tailwind background color class. */
function cellColor(cell: Cell): string {
  if (cell.isWall) return "bg-zinc-700";
  if (cell.owner !== null) return PLAYER_COLORS[cell.owner];
  return "bg-zinc-900";
}

export default function GridBattle() {
  const {
    grid,
    scores,
    isRunning,
    isFinished,
    speed,
    setSpeed,
    startBattle,
    stopBattle,
    resetGrid,
  } = useGridBattle();

  const topScore = Math.max(...scores);
  const isTie = scores.filter((s) => s === topScore).length > 1;
  const winner = gridBattleRegistry[PLAYER_ALGORITHMS[scores.indexOf(topScore)]];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">Grid Battle</h1>
      <p className="text-zinc-400 mb-10">
        Four algorithms expand from their corners and compete to claim the most
        territory. Gray cells are walls they have to route around.
      </p>

      {/* ── Controls ── */}
      <div className="flex flex-wrap gap-4 mb-10 items-center">
        <button
          onClick={resetGrid}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
        >
          Reset
        </button>
        <button
          onClick={stopBattle}
          disabled={!isRunning}
          className="px-6 py-2 bg-red-800 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={() => { void startBattle(); }}
          disabled={isRunning}
          className="px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded-md transition-colors disabled:opacity-50 font-medium"
        >
          {isRunning ? "Battling..." : "Start Battle"}
        </button>

        {/* Round delay — adjustable mid-battle via ref (no restart needed) */}
        <div className="flex items-center gap-3 ml-auto">
          <label htmlFor="round-delay" className="text-sm text-zinc-400">Delay:</label>
          <input
            id="round-delay"
            type="range"
            min="1"
            max="200"
            value={speed}
            onChange={(e) => { setSpeed(Number(e.target.value)); }}
            className="w-32 accent-sky-500"
          />
          <span className="text-sm w-12 text-zinc-400">{speed}ms</span>
        </div>
      </div>

      {/* ── Scoreboard ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {PLAYER_ALGORITHMS.map((key, i) => (
          <div
            key={key}
            className={`bg-zinc-900 border rounded-lg p-4 transition-colors ${
              isFinished && scores[i] === topScore
                ? "border-yellow-400"
                : "border-zinc-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-3 h-3 rounded-sm ${PLAYER_COLORS[i]}`} />
              <span className="text-sm text-zinc-300">
                {gridBattleRegistry[key].label}
              </span>
            </div>
            <p className="text-2xl font-light">{scores[i]}</p>
          </div>
        ))}
      </div>

      {/* Winner announcement once the board is full */}
      <p className="mb-6 text-lg h-7">
        {isFinished &&
          (isTie
            ? "It's a tie!"
            : `${winner.label} wins with ${String(topScore)} cells!`)}
      </p>

      {/* ── Grid ──
          Rendered as a CSS grid; each cell is a tiny colored square.
          The 1px gap between cells gives the grid its visible lines. */}
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

      {/* Strategy explanations pulled from the registry so they stay in sync */}
      <div className="mt-10 text-sm text-zinc-400 max-w-2xl space-y-2">
        {PLAYER_ALGORITHMS.map((key) => (
          <p key={key}>
            <strong className="text-zinc-300">
              {gridBattleRegistry[key].label}:
            </strong>{" "}
            {gridBattleRegistry[key].description}
          </p>
        ))}
      </div>
    </div>
  );
}
