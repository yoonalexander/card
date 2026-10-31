// Browser port of Concept Firewall's deterministic MRV exact-search algorithm.
// A generator advances the real search on demand; it never reads a saved answer.
export const sudokuPuzzles = [
  { name: "CLI example", clues: "530070000600195000098000060800060003400803001700020006060000280000419005000080079" },
  { name: "Backtracking challenge", clues: "100007090030020008009600500005300900010080002600004000300000010040000007007000300" },
] as const;

export type SearchFrame = {
  kind: "ready" | "inspect" | "place" | "remove" | "dead-end" | "solved" | "failed";
  board: number[];
  index: number | null;
  candidates: number[];
  value: number | null;
  nodes: number;
  placements: number;
  backtracks: number;
  reason?: string;
};

export function initialFrame(puzzle: string): SearchFrame {
  return { kind: "ready", board: [...puzzle].map(Number), index: null, candidates: [], value: null,
    nodes: 0, placements: 0, backtracks: 0 };
}

// Separate constraint check, independent of the search's candidate masks.
export function verifyCompletion(puzzle: string, board: readonly number[]): boolean {
  if (!/^[0-9]{81}$/.test(puzzle) || board.length !== 81 || board.some(n => !Number.isInteger(n) || n < 1 || n > 9)) return false;
  if ([...puzzle].some((n, i) => n !== "0" && Number(n) !== board[i])) return false;
  const valid = (unit: number[]) => new Set(unit).size === 9;
  for (let i = 0; i < 9; i++) {
    if (!valid(board.slice(i * 9, i * 9 + 9)) ||
        !valid(Array.from({ length: 9 }, (_, j) => board[j * 9 + i])) ||
        !valid(Array.from({ length: 9 }, (_, j) => board[(Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + i % 3 * 3 + j % 3]))) return false;
  }
  return true;
}

export function* solveSudoku(puzzle: string, nodeLimit = 100000): Generator<SearchFrame, void, unknown> {
  if (!Number.isInteger(nodeLimit) || nodeLimit < 1) throw new Error("Node limit must be a positive integer");
  if (!/^[0-9]{81}$/.test(puzzle)) throw new Error("A puzzle must contain exactly 81 digits");
  const board = [...puzzle].map(Number);
  const rows = Array(9).fill(0), columns = Array(9).fill(0), boxes = Array(9).fill(0);
  let nodes = 0, placements = 0, backtracks = 0, exhausted = false;
  const snapshot = (kind: SearchFrame["kind"], index: number | null = null, candidates: number[] = [], value: number | null = null, reason?: string): SearchFrame =>
    ({ kind, board: [...board], index, candidates: [...candidates], value, nodes, placements, backtracks, reason });

  for (let at = 0; at < 81; at++) {
    if (!board[at]) continue;
    const row = Math.floor(at / 9), col = at % 9, box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const bit = 1 << (board[at] - 1);
    if ((rows[row] | columns[col] | boxes[box]) & bit) {
      yield snapshot("failed", null, [], null, "Original clues conflict. No answer returned.");
      return;
    }
    rows[row] |= bit; columns[col] |= bit; boxes[box] |= bit;
  }

  function* search(): Generator<SearchFrame, boolean, unknown> {
    if (nodes >= nodeLimit) { exhausted = true; return false; }
    nodes++;
    let best = -1, choices: number[] = [], smallest = 10;
    for (let at = 0; at < 81; at++) {
      if (board[at]) continue;
      const row = Math.floor(at / 9), col = at % 9, box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      const mask = 511 & ~(rows[row] | columns[col] | boxes[box]);
      const possible = Array.from({ length: 9 }, (_, i) => i + 1).filter(n => mask & (1 << (n - 1)));
      if (!possible.length) { yield snapshot("dead-end", at); return false; }
      if (possible.length < smallest) {
        best = at; choices = possible; smallest = possible.length;
        if (smallest === 1) break;
      }
    }
    if (best < 0) return true;
    const row = Math.floor(best / 9), col = best % 9, box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    yield snapshot("inspect", best, choices);
    for (const n of choices) {
      if (exhausted) break;
      const bit = 1 << (n - 1);
      board[best] = n;
      rows[row] |= bit; columns[col] |= bit; boxes[box] |= bit;
      placements++;
      yield snapshot("place", best, choices, n);
      if (yield* search()) return true;
      rows[row] ^= bit; columns[col] ^= bit; boxes[box] ^= bit;
      board[best] = 0;
      backtracks++;
      yield snapshot("remove", best, choices, n);
    }
    return false;
  }

  if (yield* search()) {
    if (!verifyCompletion(puzzle, board)) throw new Error("Search result failed the independent verifier");
    yield snapshot("solved");
  } else {
    yield snapshot("failed", null, [], null, exhausted ? "Search budget reached. No verified answer returned." : "No completion satisfies the original clues.");
  }
}
