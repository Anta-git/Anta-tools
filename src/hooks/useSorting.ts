import { useState, useRef, useEffect, useCallback } from "react";
import { bubbleSortSteps } from "../components/sorting/bubbleSort";
import type { SortStep } from "../components/sorting/bubbleSort";
import type { Bar } from "../types/sorting";

export function useSorting() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50); // ms between steps
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

  const startSort = async () => {
    if (isSorting) return;
    setIsSorting(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const gen: Generator<SortStep> = bubbleSortSteps(bars.map((b) => b.value));

    for (const step of gen) {
      if (signal.aborted) break;

      // Translate the SortStep back into Bar[] shape for display
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
  };

  const stopSort = () => {
    abortControllerRef.current?.abort();
    setIsSorting(false);
  };

  // Generate the initial array on mount
  useEffect(() => {
    const t = setTimeout(generateArray, 0);
    return () => clearTimeout(t);
  }, [generateArray]);

  return { bars, isSorting, speed, setSpeed, generateArray, startSort, stopSort };
}