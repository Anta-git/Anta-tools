export const gridBattleRegistry = {
  bfs: { label: "BFS" },
  dfs: { label: "DFS" },
  random: { label: "Random Walk" },
  greedy: { label: "Greedy" },
} as const;

export type GridBattleAlgorithmKey = keyof typeof gridBattleRegistry;
