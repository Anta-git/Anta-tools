import { bubbleSortSteps } from "./bubbleSort";
import type { Bar, SortStep } from "../../types/sorting";

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
  // To add a new algorithm:
  // 1. Create mergeSort.ts in this folder
  // 2. Import it here and add an entry below
  // selection: { label: "Selection Sort", fn: selectionSortSteps },
  // merge:     { label: "Merge Sort",     fn: mergeSortSteps     },
  // quick:     { label: "Quick Sort",     fn: quickSortSteps     },
} as const satisfies Record<string, SortAlgorithm>;

export type SortAlgorithmKey = keyof typeof sortRegistry;