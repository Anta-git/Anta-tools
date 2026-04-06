import type { Bar, SortStep } from "../../types/sorting";

/**
 * Pure generator function for Bubble Sort.
 *
 * Completely React-agnostic — yields SortStep snapshots that the
 * consuming hook renders at whatever pace it chooses.
 *
 * Bubble Sort repeatedly walks the array comparing adjacent pairs.
 * After each full pass the largest unsorted element "bubbles" to its
 * final position at the end, so the inner loop shrinks by one each time.
 */
export function* bubbleSortSteps(initialValues: Bar["value"][]): Generator<SortStep> {
  const values = [...initialValues]; // work on a copy — never mutate the caller's data
  const n = values.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Step 1: Highlight the two bars being compared
      yield {
        values: [...values],
        comparing: [j, j + 1],
        swapping: null,
        sorted: [...sorted],
      };

      if (values[j] > values[j + 1]) {
        // Step 2: Signal that a swap is about to happen
        yield {
          values: [...values],
          comparing: null,
          swapping: [j, j + 1],
          sorted: [...sorted],
        };

        // Perform the swap in our local array
        [values[j], values[j + 1]] = [values[j + 1], values[j]];

        // Step 3: Show the array after the swap
        yield {
          values: [...values],
          comparing: null,
          swapping: [j, j + 1],
          sorted: [...sorted],
        };
      }

      // Step 4: Clear highlights before moving to the next pair
      yield {
        values: [...values],
        comparing: null,
        swapping: null,
        sorted: [...sorted],
      };
    }

    // The element that just bubbled to the end is now in its final position
    sorted.push(n - 1 - i);

    // Step 5: Mark the newly sorted element green
    yield {
      values: [...values],
      comparing: null,
      swapping: null,
      sorted: [...sorted],
    };
  }

  // Mark the very first element sorted too (the loop stops at i < n-1)
  sorted.push(0);

  // Final step: everything is sorted
  yield {
    values: [...values],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
  };
}