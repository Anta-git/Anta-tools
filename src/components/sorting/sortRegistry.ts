import type { Bar, SortStep } from "../../types/sorting";
import { bubbleSortSteps } from "./bubbleSort";
import { heapSortSteps } from "./heapSort";

export interface SortAlgorithm {
  label: string;
  timeComplexity: string;
  spaceComplexity: string;
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
