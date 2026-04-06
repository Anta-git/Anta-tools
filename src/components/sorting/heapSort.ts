import type { Bar, SortStep } from "../../types/sorting";

/**
 * Pure generator function for Heap Sort.
 *
 * Works the same way as bubbleSortSteps — completely React-agnostic,
 * yields SortStep snapshots that the consumer renders at its own pace.
 *
 * Heap Sort has two phases:
 *   1. Build a max-heap from the unsorted array (bottom-up).
 *   2. Repeatedly extract the max (root) and place it at the end,
 *      then re-heapify the shrinking unsorted portion.
 */
export function* heapSortSteps(initialValues: Bar["value"][]): Generator<SortStep> {
  const values = [...initialValues];
  const n = values.length;
  const sorted: number[] = [];

  /**
   * Restore the max-heap property for the subtree rooted at `root`.
   * Recursively sifts the value down until it's larger than both children
   * or reaches a leaf.
   */
  function* siftDown(heapSize: number, root: number): Generator<SortStep> {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    // Compare root with left child
    if (left < heapSize) {
      yield {
        values: [...values],
        comparing: [largest, left],
        swapping: null,
        sorted: [...sorted],
      };
      if (values[left] > values[largest]) {
        largest = left;
      }
    }

    // Compare current largest with right child
    if (right < heapSize) {
      yield {
        values: [...values],
        comparing: [largest, right],
        swapping: null,
        sorted: [...sorted],
      };
      if (values[right] > values[largest]) {
        largest = right;
      }
    }

    // If a child was larger, swap and continue sifting down that subtree
    if (largest !== root) {
      yield {
        values: [...values],
        comparing: null,
        swapping: [root, largest],
        sorted: [...sorted],
      };

      [values[root], values[largest]] = [values[largest], values[root]];

      yield {
        values: [...values],
        comparing: null,
        swapping: [root, largest],
        sorted: [...sorted],
      };

      yield {
        values: [...values],
        comparing: null,
        swapping: null,
        sorted: [...sorted],
      };

      // The swapped child may now violate the heap property — recurse
      yield* siftDown(heapSize, largest);
    } else {
      // No swap needed; clear highlights
      yield {
        values: [...values],
        comparing: null,
        swapping: null,
        sorted: [...sorted],
      };
    }
  }

  // Phase 1: Build max-heap from the bottom up.
  // Only internal nodes (indices 0..n/2-1) need sifting.
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(n, i);
  }

  // Phase 2: Extract the max element one-by-one.
  // Swap the root (largest) to the end, shrink the heap, and re-heapify.
  for (let i = n - 1; i > 0; i--) {
    yield {
      values: [...values],
      comparing: null,
      swapping: [0, i],
      sorted: [...sorted],
    };

    [values[0], values[i]] = [values[i], values[0]];
    sorted.push(i);

    yield {
      values: [...values],
      comparing: null,
      swapping: [0, i],
      sorted: [...sorted],
    };

    yield {
      values: [...values],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
    };

    // Restore heap property for the reduced heap
    yield* siftDown(i, 0);
  }

  // The last remaining element is already in its final position
  sorted.push(0);

  yield {
    values: [...values],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
  };
}
