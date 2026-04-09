/**
 * Grid Battle algorithm registry.
 *
 * Same pattern as the sorting registry — each entry maps a key to its
 * display label. Algorithm implementations will be added as generators
 * once the battle execution loop is built out.
 */
export const gridBattleRegistry = {
  bfs: { label: "BFS" },
  dfs: { label: "DFS" },
  random: { label: "Random Walk" },
  greedy: { label: "Greedy" },
} as const;

export type GridBattleAlgorithmKey = keyof typeof gridBattleRegistry;
