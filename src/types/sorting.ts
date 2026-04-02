export const BAR_VALUE_MIN = 50;
export const BAR_VALUE_MAX = 350;

export interface Bar {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  isCelebrating: boolean;
}

// Each step describes the full state of the array at one moment in the animation.
// The component reads these steps one-by-one and applies them to React state.
export interface SortStep {
  values: Bar["value"][]; // The array values at this step (may have been swapped)
  comparing: [number, number] | null; // Indices currently being compared (highlighted red)
  swapping: [number, number] | null; // Indices currently being swapped  (highlighted orange)
  sorted: number[]; // Indices that are fully sorted (highlighted green)
}
