import { useSorting } from "../hooks/useSorting";

export default function Sorting() {
  const { bars, isSorting, speed, setSpeed, generateArray, startSort, stopSort } = useSorting();

  const barWidth = 12;
  const maxHeight = 300;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">Sorting Visuals</h1>
      <p className="text-zinc-400 mb-10">
        Watch how sorting algorithms work step by step. Starting with Bubble Sort.
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

        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-zinc-400">Speed:</label>
          <input
            type="range"
            min="10"
            max="300"
            value={speed}
            onChange={(e) => { setSpeed(Number(e.target.value)); }}
            className="w-32 accent-sky-500"
          />
          <span className="text-sm w-12 text-zinc-400">{speed}ms</span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex justify-center items-end min-h-100">
        <div className="flex items-end gap-1" style={{ height: maxHeight }}>
          {bars.map((bar, index) => {
            const heightPercent = (bar.value / 350) * 100;
            let color = "bg-zinc-400";

            if (bar.isSorted) color = "bg-emerald-500";
            else if (bar.isSwapping) color = "bg-orange-500";
            else if (bar.isComparing) color = "bg-rose-500";

            return (
              <div
                key={index}
                className={`transition-all duration-75 rounded-t ${color}`}
                style={{
                  height: `${Math.round(heightPercent).toString()}%`,
                  width: `${Math.round(barWidth).toString()}px`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-sm text-zinc-400 max-w-2xl">
        <p className="mb-4">
          <strong>Bubble Sort</strong> — repeatedly steps through the list,
          compares adjacent elements and swaps them if they are in the wrong
          order.
        </p>
        <p>Time Complexity: O(n²) • Space Complexity: O(1)</p>
      </div>
    </div>
  );
}