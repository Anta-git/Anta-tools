import { useState, useRef, useEffect, useCallback } from "react";
import { sortRegistry } from "../components/sorting/sortRegistry";
import type { SortAlgorithmKey } from "../components/sorting/sortRegistry";
import type { Bar, SortStep } from "../types/sorting";
import { playTone } from "../utils/audio";

export const BAR_VALUE_MIN = 50;
export const BAR_VALUE_MAX = 350;

export function useSorting() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(30);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortAlgorithmKey>("bubble");
  const [isMuted, setIsMuted] = useState(false);
  const speedRef = useRef(speed);
  const isMutedRef = useRef(isMuted);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Keep speedRef in sync so changes mid-sort take effect immediately
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const generateArray = useCallback(() => {
    abortControllerRef.current?.abort(); // cancel any in-progress sort
    setIsSorting(false);
    const range = BAR_VALUE_MAX - BAR_VALUE_MIN;
    const newBars: Bar[] = Array.from({ length: arraySize }, () => ({
      value: Math.floor(Math.random() * range) + BAR_VALUE_MIN,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isCelebrating: false,
    }));
    setBars(newBars);
  }, [arraySize]);

  const startSort = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Look up the selected algorithm from the registry
    const { fn } = sortRegistry[selectedAlgorithm];
    let finalValues: number[] = bars.map((b) => b.value);
    const gen: Generator<SortStep> = fn(finalValues);

    for (const step of gen) {
      if (signal.aborted) break;

      setBars(
        step.values.map((value, i) => ({
          value,
          isComparing: step.comparing?.includes(i) ?? false,
          isSwapping: step.swapping?.includes(i) ?? false,
          isSorted: step.sorted.includes(i),
          isCelebrating: false,
        })),
      );

      if (!isMutedRef.current) {
        const activeIndex = step.swapping?.[0] ?? step.comparing?.[0];
        if (activeIndex !== undefined) playTone(step.values[activeIndex]);
      }

      finalValues = step.values;
      await new Promise((r) => setTimeout(r, speedRef.current));
    }

    if (!signal.aborted) {
      // Celebration sweep: turn each bar gold left-to-right
      for (let i = 0; i < finalValues.length; i++) {
        if (signal.aborted) break;
        setBars((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], isSorted: false, isCelebrating: true };
          return next;
        });
        if (!isMutedRef.current) playTone(finalValues[i]);
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    setIsSorting(false);
  }, [isSorting, selectedAlgorithm, bars]);

  const stopSort = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsSorting(false);
  }, []);

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
    arraySize,
    setArraySize,
    isMuted,
    setIsMuted,
    selectedAlgorithm,
    setSelectedAlgorithm,
    generateArray,
    startSort,
    stopSort,
  };
}