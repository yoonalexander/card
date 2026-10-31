const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const api = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/home/sudokuSolver.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: api });
const recorded = require('../public/assets/projects/concept-firewall/sudoku-demo.json');
const classic = api.sudokuPuzzles[0].clues;
const collect = (puzzle, limit) => Array.from(api.solveSudoku(puzzle, limit));

test('classic live search matches the Python CLI board and node accounting', () => {
  const frames = collect(classic);
  const last = frames.at(-1);
  assert.equal(last.kind, 'solved');
  assert.equal(last.board.join(''), recorded.exact_fallback.board);
  assert.equal(last.nodes, recorded.exact_fallback.search_nodes);
  assert.equal(last.placements, 51);
  assert.equal(last.backtracks, 0);
});

test('each yielded search operation preserves clues and filled-cell constraints', () => {
  const frames = collect(api.sudokuPuzzles[1].clues);
  const puzzle = api.sudokuPuzzles[1].clues;
  for (const frame of frames) {
    for (let i = 0; i < 81; i++) if (puzzle[i] !== '0') assert.equal(frame.board[i], Number(puzzle[i]));
    for (let i = 0; i < 9; i++) {
      const units = [frame.board.slice(i * 9, i * 9 + 9), Array.from({length:9}, (_, j) => frame.board[j * 9 + i]),
        Array.from({length:9}, (_, j) => frame.board[(Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + i % 3 * 3 + j % 3])];
      for (const unit of units) { const filled = unit.filter(Boolean); assert.equal(new Set(filled).size, filled.length); }
    }
  }
  assert(frames.some(f => f.kind === 'remove'));
  assert(frames.some(f => f.kind === 'dead-end'));
  assert.equal(frames.at(-1).kind, 'solved');
  assert(frames.at(-1).backtracks > 0);
  // Cross-checked with installed Concept Firewall CLI 0.2.0, without a model.
  assert.equal(frames.at(-1).nodes, 220);
  assert.equal(frames.at(-1).board.join(''), '162857493534129678789643521475312986913586742628794135356478219241935867897261354');
});

test('frames are immutable snapshots and each placement/removal changes one cell', () => {
  const frames = collect(api.sudokuPuzzles[1].clues);
  let previous = api.initialFrame(api.sudokuPuzzles[1].clues);
  for (const frame of frames) {
    const changed = frame.board.flatMap((n, i) => n !== previous.board[i] ? [i] : []);
    assert.equal(changed.length, ['place', 'remove'].includes(frame.kind) ? 1 : 0);
    if (changed.length) assert.equal(changed[0], frame.index);
    previous = frame;
  }
});

test('generator suspends search between next calls and can be cancelled', () => {
  const search = api.solveSudoku(classic);
  const inspected = search.next().value;
  assert.equal(inspected.kind, 'inspect');
  assert.equal(inspected.board.filter(Boolean).length, 30);
  assert.equal(search.next().value.kind, 'place');
  assert.equal(inspected.board.filter(Boolean).length, 30);
  search.return();
  assert.equal(search.next().done, true);
});

test('node budget cannot produce an accepted partial answer', () => {
  const frames = collect(classic, 1);
  assert.equal(frames.at(-1).kind, 'failed');
  assert.equal(frames.at(-1).nodes, 1);
  assert.match(frames.at(-1).reason, /budget/);
  assert(!frames.some(f => f.kind === 'solved'));
});

test('conflicting clues and malformed inputs fail explicitly', () => {
  assert.equal(collect('55' + classic.slice(2)).at(-1).kind, 'failed');
  assert.throws(() => collect('short'), /81 digits/);
  assert.throws(() => collect(classic, 0), /positive integer/);
});

test('consistent but impossible clues return unsatisfiable instead of a partial answer', () => {
  const impossible = classic.slice(0, 2) + '1' + classic.slice(3);
  const frames = collect(impossible);
  assert.equal(frames.at(-1).kind, 'failed');
  assert.match(frames.at(-1).reason, /No completion/);
  assert(!frames.some(f => f.kind === 'solved'));
});

test('an already complete valid grid is checked without placements', () => {
  const last = collect(recorded.exact_fallback.board).at(-1);
  assert.equal(last.kind, 'solved');
  assert.equal(last.nodes, 1);
  assert.equal(last.placements, 0);
});

test('independent verifier rejects changes to clues and invalid completed units', () => {
  const board = [...recorded.exact_fallback.board].map(Number);
  assert.equal(api.verifyCompletion(classic, board), true);
  const changed = [...board]; changed[0] = 6;
  assert.equal(api.verifyCompletion(classic, changed), false);
  assert.equal(api.verifyCompletion(classic, board.slice(1)), false);
  const incomplete = [...board]; incomplete[2] = 0;
  assert.equal(api.verifyCompletion(classic, incomplete), false);
  assert.equal(api.verifyCompletion('0'.repeat(81), Array(81).fill(1)), false);
});
