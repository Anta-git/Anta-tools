import { useSorting, BAR_VALUE_MAX } from "../hooks/useSorting";
import { sortRegistry } from "../components/sorting/sortRegistry";
import type { SortAlgorithmKey } from "../components/sorting/sortRegistry";

export default function Sorting() {
  const {
    bars,
    isSorting,
    speed,
    setSpeed,
    arraySize,
    setArraySize,
    isMuted,
    setIsMuted,
    selectedAlgorithm,
    setSelectedAlgorithm,
    generateArray,
    startSort,
    stopSort,
  } = useSorting();

  const maxHeight = 300;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">Sorting Visuals</h1>
      <p className="text-zinc-400 mb-10">
        Watch how sorting algorithms work step by step.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-10 items-center">
        <button
          onClick={generateArray}
          disabled={isSorting}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors disabled:opacity-50"
        >
          New Array
        </button>
        <button
          onClick={stopSort}
          disabled={!isSorting}
          className="px-6 py-2 bg-red-800 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={() => { void startSort(); }}
          disabled={isSorting}
          className="px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded-md transition-colors disabled:opacity-50 font-medium"
        >
          {isSorting ? "Sorting..." : "Start Sort"}
        </button>
        <button
          onClick={() => { setIsMuted((m) => !m); }}
          className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        {/* Algorithm selector — add entries to sortRegistry.ts to populate this */}
        <select
          value={selectedAlgorithm}
          onChange={(e) => { setSelectedAlgorithm(e.target.value as SortAlgorithmKey); }}
          disabled={isSorting}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors disabled:opacity-50 text-white"
        >
          {(Object.entries(sortRegistry) as [SortAlgorithmKey, { label: string }][]).map(
            ([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            )
          )}
        </select>

        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-zinc-400">Size:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => { setArraySize(Number(e.target.value)); generateArray(); }}
            disabled={isSorting}
            className="w-32 accent-sky-500 disabled:opacity-50"
          />
          <span className="text-sm w-8 text-zinc-400">{arraySize}</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-400">Delay:</label>
          <input
            type="range"
            min="1"
            max="300"
            value={speed}
            onChange={(e) => { setSpeed(Number(e.target.value)); }}
            className="w-32 accent-sky-500"
          />
          <span className="text-sm w-12 text-zinc-400">{speed}ms</span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 min-h-100" style={{ height: maxHeight + 64 }}>
        <div className="flex items-end gap-px w-full" style={{ height: maxHeight }}>
          {bars.map((bar, index) => {
            const heightPercent = (bar.value / BAR_VALUE_MAX) * 100;
            let color = "bg-zinc-400";

            if (bar.isCelebrating) color = "bg-yellow-400";
            else if (bar.isSorted) color = "bg-emerald-500";
            else if (bar.isSwapping) color = "bg-orange-500";
            else if (bar.isComparing) color = "bg-rose-500";

            return (
              <div
                key={index}
                className={`transition-all duration-75 rounded-t flex-1 min-w-0 ${color}`}
                style={{ height: `${Math.round(heightPercent).toString()}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Algorithm description — reads label from registry so it stays in sync */}
      <div className="mt-10 text-sm text-zinc-400 max-w-2xl">
        <p className="mb-4">
          <strong>{sortRegistry[selectedAlgorithm].label}</strong>
        </p>
        <p>Time Complexity: {sortRegistry[selectedAlgorithm].timeComplexity} • Space Complexity: {sortRegistry[selectedAlgorithm].spaceComplexity}</p>
        <p>-Assuming worse case scenario</p>
      </div>
    </div>
  );
}