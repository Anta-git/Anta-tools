import type { Bar, SortStep } from "../../types/sorting";

export function* heapSortSteps(initialValues: Bar["value"][]): Generator<SortStep> {
  const values = [...initialValues];
  const n = values.length;
  const sorted: number[] = [];

  // Sift down to restore max-heap property for a subtree rooted at `root`
  // within a heap of size `heapSize`.
  function* siftDown(heapSize: number, root: number): Generator<SortStep> {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

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

      yield* siftDown(heapSize, largest);
    } else {
      yield {
        values: [...values],
        comparing: null,
        swapping: null,
        sorted: [...sorted],
      };
    }
  }

  // Phase 1: Build max-heap (bottom-up)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(n, i);
  }

  // Phase 2: Repeatedly move the heap root (max) to its final position
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

    yield* siftDown(i, 0);
  }

  // The final remaining element at index 0 is also in place
  sorted.push(0);

  yield {
    values: [...values],
    comparing: null,
    swapping: null,
    sorted: [...sorted],
  };
}
