const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');
const evidence = require('../public/assets/projects/concept-firewall/ncm-replay.json');
const api = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/home/ncmReplay.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: api });
const classic = require('../public/assets/projects/concept-firewall/sudoku-demo.json');

test('all displayed boards are the exact retained snapshots, not generated frames', () => {
  for (const example of evidence.cases) for (const method of ['prefix', 'restart']) {
    const expected = [example.puzzle, example.level6, example.final, example.retries[method].board];
    for (let phase = 0; phase < 4; phase++) assert.equal(api.replayBoard(example, phase, method), expected[phase]);
    assert.throws(() => api.replayBoard(example, 4, method), /Unknown/);
  }
});

test('both recovering and unrecovered examples are retained and checked', () => {
  assert.equal(evidence.cases.length, 4);
  const outcomes = new Set();
  for (const example of evidence.cases) {
    assert.equal(api.inspectReplayBoard(example.puzzle, example.final).valid, false);
    assert.equal(example.warning.alert, true);
    for (const method of ['prefix', 'restart']) assert.equal(api.inspectReplayBoard(example.puzzle, example.retries[method].board).valid, example.retries[method].valid);
    outcomes.add(`${example.retries.prefix.valid}/${example.retries.restart.valid}`);
  }
  assert.equal(outcomes.size, 4);
});

test('verifier counts exact clue changes and duplicate occurrences without a reference solution', () => {
  const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
  const good = classic.exact_fallback.board;
  assert.equal(api.inspectReplayBoard(puzzle, good).valid, true);
  const bad = '3' + good.slice(1);
  const result = api.inspectReplayBoard(puzzle, bad);
  assert.equal(result.changedClues, 1);
  assert.equal(result.rows, 1);
  assert.equal(result.columns, 1);
  assert.equal(result.boxes, 1);
  assert(result.conflictCells.has(0));
  assert(result.conflictCells.has(1));
  assert.equal(result.valid, false);
  assert.equal(api.inspectReplayBoard(puzzle, puzzle).valid, false);
  assert.throws(() => api.inspectReplayBoard(puzzle, 'broken'), /81-cell/);
});

test('replay metadata states source hashes, curation and no new inference', () => {
  for (const source of Object.values(evidence.sources)) assert.match(source.sha256, /^[a-f0-9]{64}$/);
  for (const example of evidence.cases) for (const hash of Object.values(example.source_line_sha256)) assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(evidence.model_execution_during_export, false);
  assert.match(evidence.scope, /not representative/);
  assert.match(evidence.snapshots, /not retained here or fabricated/);
  assert.match(evidence.retry_design, /not sequential/);
});

const retainedSourcesAvailable = fs.existsSync('../Concept-Firewall/results/continuation/evidence_inventory.json') &&
  Object.values(evidence.sources).every(source => fs.existsSync('../Concept-Firewall/' + source.path));
test('source hashes match original research tables when those retained artifacts are available', {
  skip: retainedSourcesAvailable ? false : 'Original research tables are not distributed with the portfolio',
}, () => {
  const inventory = JSON.parse(fs.readFileSync('../Concept-Firewall/results/continuation/evidence_inventory.json', 'utf8'));
  for (const [key, source] of Object.entries(evidence.sources)) {
    const entry = inventory.files.find(item => item.path === source.path);
    assert.equal(source.sha256, entry.sha256);
    const raw = fs.readFileSync('../Concept-Firewall/' + source.path);
    assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), source.sha256);
    const lines = new Map(raw.toString('utf8').trim().split(/\r?\n/).map(line => [JSON.parse(line).puzzle_id, line]));
    for (const example of evidence.cases) assert.equal(crypto.createHash('sha256').update(lines.get(example.id)).digest('hex'), example.source_line_sha256[key]);
  }
});
