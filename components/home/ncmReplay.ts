export type ReplayCase = {
  id: string;
  label: string;
  puzzle: string;
  level6: string;
  final: string;
  warning: { score: number; alert: boolean };
  retries: { prefix: { board: string; valid: boolean }; restart: { board: string; valid: boolean } };
};

export type RetryMethod = "prefix" | "restart";

export function replayBoard(example: ReplayCase, phase: number, method: RetryMethod): string {
  if (phase === 0) return example.puzzle;
  if (phase === 1) return example.level6;
  if (phase === 2) return example.final;
  if (phase === 3) return example.retries[method].board;
  throw new Error("Unknown recorded snapshot");
}

// Exact constraints only: no model, candidate search or reference solution.
export function inspectReplayBoard(puzzle: string, board: string) {
  if (!/^[0-9]{81}$/.test(puzzle) || !/^[0-9]{81}$/.test(board)) throw new Error("Expected 81-cell snapshots");
  const conflictCells = new Set<number>();
  const changedClues = [...puzzle].flatMap((n, i) => n !== "0" && n !== board[i] ? [i] : []);
  changedClues.forEach(i => conflictCells.add(i));
  function conflicts(indices: number[]) {
    const groups = new Map<string, number[]>();
    for (const i of indices) {
      if (board[i] === "0") continue;
      groups.set(board[i], [...(groups.get(board[i]) || []), i]);
    }
    let total = 0;
    groups.forEach(group => {
      if (group.length > 1) { total += group.length - 1; group.forEach(i => conflictCells.add(i)); }
    });
    return total;
  }
  let rows = 0, columns = 0, boxes = 0;
  for (let i = 0; i < 9; i++) {
    rows += conflicts(Array.from({ length: 9 }, (_, j) => i * 9 + j));
    columns += conflicts(Array.from({ length: 9 }, (_, j) => j * 9 + i));
    boxes += conflicts(Array.from({ length: 9 }, (_, j) => (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + i % 3 * 3 + j % 3));
  }
  const filled = [...board].filter(n => n !== "0").length;
  return { changedClues: changedClues.length, rows, columns, boxes, filled, conflictCells,
    valid: filled === 81 && changedClues.length === 0 && rows === 0 && columns === 0 && boxes === 0 };
}
