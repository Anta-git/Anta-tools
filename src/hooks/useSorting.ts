import { useState, useRef, useEffect, useCallback } from "react";
import { sortRegistry } from "../components/sorting/sortRegistry";
import type { SortAlgorithmKey } from "../components/sorting/sortRegistry";
import type { SortStep } from "../components/sorting/bubbleSort";
import type { Bar } from "../types/sorting";

export function useSorting() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithmKey>("bubble");
  const speedRef = useRef(speed);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Keep speedRef in sync so changes mid-sort take effect immediately
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const generateArray = useCallback(() => {
    abortControllerRef.current?.abort(); // cancel any in-progress sort
    setIsSorting(false);
    const newBars: Bar[] = Array.from({ length: 30 }, () => ({
      value: Math.floor(Math.random() * 300) + 50,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    }));
    setBars(newBars);
  }, []);

  const startSort = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Look up the selected algorithm from the registry
    const { fn } = sortRegistry[selectedAlgorithm];
    const gen: Generator<SortStep> = fn(bars.map((b) => b.value));

    for (const step of gen) {
      if (signal.aborted) break;

      setBars(
        step.values.map((value, i) => ({
          value,
          isComparing: step.comparing?.includes(i) ?? false,
          isSwapping: step.swapping?.includes(i) ?? false,
          isSorted: step.sorted.includes(i),
        })),
      );

      await new Promise((r) => setTimeout(r, speedRef.current));
    }

    setIsSorting(false);
  }, [isSorting, selectedAlgorithm, bars]);

  const stopSort = () => {
    abortControllerRef.current?.abort();
    setIsSorting(false);
  };

  // Generate the initial array on mount
  useEffect(() => {
    const t = setTimeout(generateArray, 0);
    return () => { clearTimeout(t); };
  }, [generateArray]);

  return {
    bars,
    isSorting,
    speed,
    setSpeed,
    selectedAlgorithm,
    setSelectedAlgorithm,
    generateArray,
    startSort,
    stopSort,
  };
}