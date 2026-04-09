// Value bounds for randomly generated bars. Also used by the audio
// module to map bar values into audible frequencies.
export const BAR_VALUE_MIN = 50;
export const BAR_VALUE_MAX = 350;

/** Represents a single bar in the visualizer, including its current visual state. */
export interface Bar {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
  isCelebrating: boolean;
}

/**
 * A single animation frame produced by a sorting generator.
 *
 * Each step is a complete snapshot of the array at one point in time.
 * The hook consumes these one-by-one and maps them onto Bar[] state
 * so the UI can highlight active operations.
 */
export interface SortStep {
  values: Bar["value"][];              // Array values at this point (may have been swapped)
  comparing: [number, number] | null;  // Pair being compared (highlighted rose)
  swapping: [number, number] | null;   // Pair being swapped  (highlighted orange)
  sorted: number[];                    // Indices in their final position (highlighted emerald)
}
