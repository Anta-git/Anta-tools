/**
 * Custom hook that owns all Grid Battle state and the run loop.
 *
 * Mirrors useSorting: the engine generator produces one BattleStep per
 * round, and this hook consumes them with a configurable delay between
 * frames. The page component stays purely presentational.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  battleSteps,
  createGrid,
} from "../components/grid-battle/gridBattleEngine";

const INITIAL_SCORES = [1, 1, 1, 1]; // each player starts owning its corner

export function useGridBattle() {
  const [grid, setGrid] = useState(createGrid);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(40);

  // Mirrors the speed state so the async run loop always reads the
  // latest value without restarting.
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Holds the AbortController for the currently running battle, if any.
  const abortControllerRef = useRef<AbortController | null>(null);

  /** Stop any running battle and rebuild a fresh randomized grid. */
  const resetGrid = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsRunning(false);
    setIsFinished(false);
    setGrid(createGrid());
    setScores(INITIAL_SCORES);
  }, []);

  /**
   * Run the battle to completion (or until stopped). Starting after a
   * finished battle resets the board first; starting after a stop
   * resumes from the current grid.
   */
  const startBattle = useCallback(async () => {
    if (isRunning) return;

    let startGrid = grid;
    if (isFinished) {
      startGrid = createGrid();
      setGrid(startGrid);
      setScores(INITIAL_SCORES);
      setIsFinished(false);
    }

    setIsRunning(true);
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    for (const step of battleSteps(startGrid)) {
      if (signal.aborted) break;
      setGrid(step.grid);
      setScores(step.scores);
      await new Promise((r) => setTimeout(r, speedRef.current));
    }

    if (!signal.aborted) setIsFinished(true);
    setIsRunning(false);
  }, [isRunning, isFinished, grid]);

  /** Pause the battle in place — Start resumes from the current grid. */
  const stopBattle = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsRunning(false);
  }, []);

  // Clean up on unmount: stop any running battle.
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    grid,
    scores,
    isRunning,
    isFinished,
    speed,
    setSpeed,
    startBattle,
    stopBattle,
    resetGrid,
  };
}
