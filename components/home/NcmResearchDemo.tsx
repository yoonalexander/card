"use client";

import { useEffect, useState } from "react";
import evidence from "../../public/assets/projects/concept-firewall/ncm-replay.json";
import { inspectReplayBoard, replayBoard, type RetryMethod } from "./ncmReplay";

const phases = ["Input", "Level 6", "Final output", "Retry"];
const caseLabels = ["Both recover", "Restart only", "Prefix only", "Neither recovers"];

export default function NcmResearchDemo() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [method, setMethod] = useState<RetryMethod>("restart");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const example = evidence.cases[caseIndex];
  const board = replayBoard(example, phase, method);
  const previous = replayBoard(example, Math.max(0, phase - 1), method);
  const inspection = inspectReplayBoard(example.puzzle, board);
  const clueCount = [...example.puzzle].filter(n => n !== "0").length;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (phase === 3) setPlaying(false);
      else setPhase(current => current + 1);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [playing, phase]);

  function showPhase(next: number) { setPlaying(false); setPhase(next); }

  const status = phase === 0 ? `${clueCount} original clues` : phase === 1 ? "Intermediate whole-grid decode" :
    inspection.valid ? "✓ Verified completion" : phase === 2 ? "Original output rejected" : "Retry also rejected";
  const title = phase === 0 ? "The puzzle goes into NCM" : phase === 1 ? "Refine the whole grid, in parallel" :
    phase === 2 ? "Check the final generated board" : method === "restart" ? "Generate a new complete hierarchy" : "Keep the prefix, resample the rest";
  const description = phase === 0 ? "NCM predicts a hierarchy of latent codes, coarse to fine. Positions within each level are predicted in parallel; it does not fill Sudoku cells through backtracking." :
    phase === 1 ? "This is the saved decode of the cumulative level-6 prefix. It covers the whole board and can still violate Sudoku constraints. Later levels refine it; this is not the final answer." :
    phase === 2 ? "The original final NCM output is a complete proposed board. Exact constraint checks reject this recorded attempt. Filled cells alone do not make a correct answer." :
    method === "restart" ? "This saved full stochastic restart generates from the original input again, at temperature 0.5. The complete returned board is checked before acceptance." :
    "This saved retry forces the original level-6 code prefix and samples later levels at temperature 0.5. It recomputes attention; it is not cached resumption or cell-by-cell repair.";

  return (
    <div className={`sudoku-demo ncm-replay${phase > 1 && inspection.valid ? " ncm-replay-verified" : ""}`}>
      <header className="sudoku-live-header">
        <div className="sudoku-live-eyebrow"><span className="sudoku-live-dot" /> Recorded NCM research</div>
        <h3>Whole-grid generation, then a retry.</h3>
        <p>Real saved outputs · no live model inference</p>
      </header>

      <div className="sudoku-live-toolbar">
        <label>Curated example<select aria-label="Recorded NCM example" value={caseIndex} onChange={event => {
          setCaseIndex(Number(event.target.value)); showPhase(0);
        }}>{evidence.cases.map((item, index) => <option value={index} key={item.id}>{caseLabels[index] || item.label}</option>)}</select></label>
        <label>Compare retry method<select aria-label="Recorded retry method" value={method} onChange={event => {
          setMethod(event.target.value as RetryMethod); setPlaying(false);
        }}><option value="restart">Restart</option><option value="prefix">Fixed prefix</option></select></label>
      </div>

      <ol className="ncm-replay-phases" aria-label="Recorded NCM snapshots">
        {phases.map((name, index) => <li key={name}><button type="button" aria-pressed={phase === index} onClick={() => showPhase(index)}>{name}</button></li>)}
      </ol>

      <div className="sudoku-demo-controls">
        <button className="sudoku-demo-play" type="button" onClick={() => {
          if (phase === 3 && !playing) setPhase(0);
          setPlaying(current => !current);
        }}>{playing ? "Pause" : phase === 3 ? "Replay recorded run" : "Play recorded run"}</button>
        <button type="button" onClick={() => showPhase(phase === 3 ? 0 : phase + 1)}>{phase === 3 ? "Start again" : "Next snapshot"}</button>
      </div>

      <div className="sudoku-demo-main">
        <figure className="sudoku-demo-board-wrap">
          <div className="sudoku-live-board-frame">
            <table className="sudoku-demo-board" aria-label="Recorded NCM board">
              <tbody className="ncm-replay-grid" key={`${example.id}-${phase}-${method}`}>
                {Array.from({ length: 9 }, (_, row) => <tr key={row}>{Array.from({ length: 9 }, (_, column) => {
                  const index = row * 9 + column;
                  const given = example.puzzle[index] !== "0";
                  const conflict = phase > 0 && inspection.conflictCells.has(index);
                  const changed = phase > 0 && board[index] !== previous[index];
                  const classes = ["sudoku-demo-cell", given ? "sudoku-demo-cell-given" : "",
                    changed ? "ncm-replay-changed" : "", conflict ? "ncm-replay-conflict" : ""].filter(Boolean).join(" ");
                  return <td key={column} className={classes} data-value={board[index]}
                    aria-label={`Row ${row + 1}, column ${column + 1}: ${board[index] === "0" ? "empty" : board[index]}${given ? `; original clue ${example.puzzle[index]}` : ""}${conflict ? "; constraint violation" : ""}`}>
                    <span aria-hidden="true">{board[index] === "0" ? "" : board[index]}</span>
                  </td>;
                })}</tr>)}
              </tbody>
            </table>
          </div>
          <figcaption className="sudoku-demo-legend">
            <span><i className="sudoku-demo-given-key" /> Original clue position</span>
            {phase > 0 ? <><span><i className="sudoku-demo-filled-key" /> Changed since prior snapshot</span><span><i className="sudoku-live-undo-key" /> Constraint violation</span></> : null}
          </figcaption>
        </figure>

        <div className="sudoku-demo-explanation ncm-replay-explanation">
          <p className={`sudoku-demo-status${phase > 1 && !inspection.valid ? " ncm-replay-rejected" : ""}`} role="status">{status}</p>
          <h4>{title}</h4>
          <p>{description}</p>
          {phase === 1 ? <p className="ncm-replay-warning">Recorded warning: {example.warning.alert ? "raised" : "not raised"} · score {example.warning.score.toFixed(3)}. Observed before later generation.</p> : null}
          {phase > 0 ? <dl className="ncm-replay-checks" aria-label="Exact constraint checks">
            <div><dt>Clue changes</dt><dd>{inspection.changedClues}</dd></div>
            <div><dt>Row conflicts</dt><dd>{inspection.rows}</dd></div>
            <div><dt>Column conflicts</dt><dd>{inspection.columns}</dd></div>
            <div><dt>Box conflicts</dt><dd>{inspection.boxes}</dd></div>
          </dl> : null}
          {phase === 3 ? <p className="ncm-replay-method-note">The retry methods are alternative single recorded attempts. Switching methods does not show a second sequential retry.</p> : null}
        </div>
      </div>

      <p className="ncm-replay-finding"><strong>Study finding:</strong> no established useful learned recovery-allocation advantage. These four curated examples are not a success-rate estimate.</p>
      <p className="sudoku-demo-scope">Playback changes whole-grid snapshots together. Only the input, level-6 decode, final output and selected retry outcome are shown; omitted intermediate levels are not fabricated. Playback timing is illustrative.</p>
      <details className="sudoku-demo-evidence">
        <summary>Research evidence and recorded data</summary>
        <div>
          <a href="https://github.com/yoonalexander/Concept-Firewall/blob/main/results/reports/confidence_allocation_recovery.md" target="_blank" rel="noopener noreferrer">Recovery study</a>
          <a href="https://github.com/HazyResearch/ncm#coarse-to-fine-generation" target="_blank" rel="noopener noreferrer">How NCM generates</a>
          <a href="/assets/projects/concept-firewall/ncm-replay.json" target="_blank" rel="noopener noreferrer">Snapshots and source hashes</a>
          <a href="/assets/projects/concept-firewall/sudoku-source-LICENSE.txt" target="_blank" rel="noopener noreferrer">Puzzle data dedication</a>
        </div>
      </details>
    </div>
  );
}
