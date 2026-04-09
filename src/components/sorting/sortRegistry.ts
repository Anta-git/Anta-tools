/**
 * Sorting algorithm registry.
 *
 * Central lookup for every sorting algorithm the visualizer supports.
 * Each entry pairs a generator function (the algorithm) with display
 * metadata (label, complexities). The UI reads this registry to build
 * the algorithm dropdown and the info panel — adding a new algorithm
 * is as simple as writing its generator and adding one entry here.
 */
import type { Bar, SortStep } from "../../types/sorting";
import { bubbleSortSteps } from "./bubbleSort";
import { heapSortSteps } from "./heapSort";

export interface SortAlgorithm {
  label: string;
  timeComplexity: string;
  spaceComplexity: string;
  /** A generator that yields one SortStep per visual frame. */
  fn: (values: Bar["value"][]) => Generator<SortStep>;
}

export const sortRegistry = {
  bubble: {
    label: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    fn: bubbleSortSteps,
  },
  heap: {
    label: "Heap Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    fn: heapSortSteps,
  },
} as const satisfies Record<string, SortAlgorithm>;

export type SortAlgorithmKey = keyof typeof sortRegistry;
