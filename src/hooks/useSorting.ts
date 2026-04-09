/**
 * Custom hook that owns all sorting visualizer state and logic.
 *
 * Responsibilities:
 *  - Generating and storing the bar array
 *  - Running a selected sorting algorithm step-by-step via its generator
 *  - Playing audio tones for each comparison/swap
 *  - Supporting mid-sort speed changes and abort/stop
 *  - Running a celebration sweep when sorting completes
 *
 * The Sorting page component consumes this hook and stays purely
 * presentational — it never touches algorithm logic directly.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { sortRegistry } from "../components/sorting/sortRegistry";
import type { SortAlgorithmKey } from "../components/sorting/sortRegistry";
import { BAR_VALUE_MAX, BAR_VALUE_MIN, type Bar, type SortStep } from "../types/sorting";
import { playTone, suspendAudio } from "../utils/audio";

export function useSorting() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(30);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<SortAlgorithmKey>("bubble");
  const [isMuted, setIsMuted] = useState(false);

  // Refs mirror state values so the async sort loop always reads the
  // latest setting without needing to restart.
  const speedRef = useRef(speed);
  const isMutedRef = useRef(isMuted);

  // Holds the AbortController for the currently running sort, if any.
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  /** Create a fresh randomized array, cancelling any in-progress sort. */
  const generateArray = useCallback(() => {
    abortControllerRef.current?.abort();
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

  /**
   * Kick off the sort. We iterate through the algorithm's generator
   * one step at a time, updating React state and playing audio between
   * each yield. The loop respects the abort signal so the user can stop
   * at any point.
   */
  const startSort = useCallback(async () => {
    if (isSorting) return;
    setIsSorting(true);

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const { fn } = sortRegistry[selectedAlgorithm];
    let finalValues: number[] = bars.map((b) => b.value);
    const gen: Generator<SortStep> = fn(finalValues);

    // Consume each SortStep from the generator with a delay between frames
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

      // Play a tone pitched to whichever bar is actively being operated on
      if (!isMutedRef.current) {
        const activeIndex = step.swapping?.[0] ?? step.comparing?.[0];
        if (activeIndex !== undefined) playTone(step.values[activeIndex]);
      }

      finalValues = step.values;
      await new Promise((r) => setTimeout(r, speedRef.current));
    }

    // Celebration sweep: light each bar gold from left to right
    for (let i = 0; i < finalValues.length; i++) {
        if (!signal.aborted) {
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

  /** Immediately cancel the running sort. */
  const stopSort = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsSorting(false);
  }, []);

  // Clean up on unmount: stop any running sort and suspend the audio context
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      suspendAudio();
    };
  }, []);

  // Generate the initial array on mount (and whenever arraySize changes)
  useEffect(() => {
    const t = setTimeout(generateArray, 0);
    return () => {
      clearTimeout(t);
    };
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
