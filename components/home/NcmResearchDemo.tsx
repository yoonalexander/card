"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import evidence from "../../public/assets/projects/concept-firewall/ncm-replay.json";
import { inspectReplayBoard, replayBoard, type RetryMethod } from "./ncmReplay";

const phases = ["Input", "Level 6", "Final output", "Retry"];
const caseLabels = ["Both recover", "Restart only", "Prefix only", "Neither recovers"];
const CROSSFADE_MS = 650;

type BoardSnapshot = { puzzle: string; board: string; previous: string; phase: number };

function SnapshotGrid({ snapshot, outgoing = false }: { snapshot: BoardSnapshot; outgoing?: boolean }) {
  const { puzzle, board, previous, phase } = snapshot;
  const inspection = inspectReplayBoard(puzzle, board);
  return <table className={`sudoku-demo-board${outgoing ? " ncm-grid-outgoing" : ""}${phase > 1 && inspection.valid ? " ncm-grid-verified" : ""}`}
    aria-label={outgoing ? undefined : "Recorded NCM board"} aria-hidden={outgoing || undefined}>
    <tbody>{Array.from({ length: 9 }, (_, row) => <tr key={row}>{Array.from({ length: 9 }, (_, column) => {
      const index = row * 9 + column;
      const given = puzzle[index] !== "0";
      const conflict = phase > 0 && inspection.conflictCells.has(index);
      const changed = phase > 0 && board[index] !== previous[index];
      const classes = ["sudoku-demo-cell", given ? "sudoku-demo-cell-given" : "",
        changed ? "ncm-replay-changed" : "", conflict ? "ncm-replay-conflict" : ""].filter(Boolean).join(" ");
      return <td key={column} className={classes} data-value={board[index]}
        aria-label={`Row ${row + 1}, column ${column + 1}: ${board[index] === "0" ? "empty" : board[index]}${given ? `; original clue ${puzzle[index]}` : ""}${conflict ? "; constraint violation" : ""}`}>
        <span aria-hidden="true">{board[index] === "0" ? "" : board[index]}</span>
      </td>;
    })}</tr>)}</tbody>
  </table>;
}

// Blend two real whole-grid snapshots together; never invent intermediate digits.
function SnapshotBoard({ snapshot, snapshotKey }: { snapshot: BoardSnapshot; snapshotKey: string }) {
  const last = useRef({ snapshot, key: snapshotKey });
  const [outgoing, setOutgoing] = useState<{ snapshot: BoardSnapshot; key: string } | null>(null);
  useLayoutEffect(() => {
    if (last.current.key === snapshotKey) return;
    setOutgoing(last.current);
    last.current = { snapshot, key: snapshotKey };
    const timer = window.setTimeout(() => setOutgoing(null), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [snapshot, snapshotKey]);

  return <div className="sudoku-live-board-frame ncm-board-stack" style={{ "--ncm-crossfade": `${CROSSFADE_MS}ms` } as CSSProperties}>
    <SnapshotGrid snapshot={snapshot} />
    {outgoing ? <SnapshotGrid key={outgoing.key} snapshot={outgoing.snapshot} outgoing /> : null}
  </div>;
}

export default function NcmResearchDemo() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [method, setMethod] = useState<RetryMethod>("restart");
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const example = evidence.cases[caseIndex];
  const board = replayBoard(example, phase, method);
  const previous = replayBoard(example, Math.max(0, phase - 1), method);
  const snapshot = useMemo(() => ({ puzzle: example.puzzle, board, previous, phase }), [example.puzzle, board, previous, phase]);
  const inspection = inspectReplayBoard(example.puzzle, board);
  const clueCount = [...example.puzzle].filter(n => n !== "0").length;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (phase === 3) setPlaying(false);
      else setPhase(current => current + 1);
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [playing, phase]);

  function showPhase(next: number) { setPlaying(false); setPhase(next); }

  const status = phase === 0 ? `${clueCount} original clues` : phase === 1 ? "Whole-grid refinement" :
    inspection.valid ? "✓ Verified completion" : phase === 2 ? "Output rejected · constraint violations" : "Retry rejected · constraint violations";

  return (
    <div className={`sudoku-demo ncm-replay${phase > 1 && inspection.valid ? " ncm-replay-verified" : ""}`}>
      <div className="sudoku-live-toolbar">
        <label>Example<select aria-label="Recorded NCM example" value={caseIndex} onChange={event => {
          setCaseIndex(Number(event.target.value)); showPhase(0);
        }}>{evidence.cases.map((item, index) => <option value={index} key={item.id}>{caseLabels[index] || item.label}</option>)}</select></label>
        <label>Retry method<select aria-label="Recorded retry method" value={method} onChange={event => {
          setMethod(event.target.value as RetryMethod); setPlaying(false);
        }}><option value="restart">Restart</option><option value="prefix">Fixed prefix</option></select></label>
      </div>

      <ol className="ncm-replay-phases" aria-label="Recorded NCM snapshots">
        {phases.map((name, index) => <li key={name}><button type="button" aria-pressed={phase === index} onClick={() => showPhase(index)}>{name}</button></li>)}
      </ol>

      <figure className="sudoku-demo-board-wrap">
        <SnapshotBoard snapshot={snapshot} snapshotKey={`${example.id}-${phase}-${method}`} />
        <figcaption className="sudoku-demo-legend">
          <span><i className="sudoku-demo-given-key" /> Clue position</span>
          <span><i className="ncm-replay-changed-key" /> Changed</span>
          <span><i className="sudoku-live-undo-key" /> Conflict</span>
        </figcaption>
      </figure>

      <p className={`sudoku-demo-status ncm-replay-status${phase > 1 && !inspection.valid ? " ncm-replay-rejected" : ""}`} role="status">{status}</p>

      <div className="sudoku-demo-controls">
        <button className="sudoku-demo-play" type="button" onClick={() => {
          if (phase === 3 && !playing) setPhase(0);
          setPlaying(current => !current);
        }}>{playing ? "Pause" : phase === 3 ? "Replay" : "Play"}</button>
        <button type="button" onClick={() => showPhase(phase === 3 ? 0 : phase + 1)}>{phase === 3 ? "Reset" : "Next"}</button>
      </div>

      <p className="sudoku-demo-scope ncm-replay-disclosure">Recorded outputs · no live inference · illustrative timing</p>
      <details className="sudoku-demo-evidence">
        <summary>About this replay</summary>
        <p>NCM generates in parallel within each coarse-to-fine level. This replay shows the input, saved level-6 decode, final output and one retry. Other levels are omitted; the crossfade is a visual transition.</p>
        <p>Restart generates again from the input. Fixed prefix keeps the original level-6 codes and resamples later levels. These are alternative single attempts, not sequential retries.</p>
        <p><strong>Study finding:</strong> no established useful learned recovery-allocation advantage. These four curated examples are not a success-rate estimate.</p>
        {phase === 1 ? <p>Recorded warning: {example.warning.alert ? "raised" : "not raised"} · score {example.warning.score.toFixed(3)}.</p> : null}
        {phase > 0 ? <p>Constraint checks: {inspection.changedClues} clue changes, {inspection.rows} row, {inspection.columns} column and {inspection.boxes} box conflicts.</p> : null}
        <div>
          <a href="https://github.com/yoonalexander/Concept-Firewall/blob/main/results/reports/confidence_allocation_recovery.md" target="_blank" rel="noopener noreferrer">Recovery study</a>
          <a href="https://github.com/HazyResearch/ncm#coarse-to-fine-generation" target="_blank" rel="noopener noreferrer">How NCM generates</a>
          <a href="/assets/projects/concept-firewall/ncm-replay.json" target="_blank" rel="noopener noreferrer">Recorded data</a>
          <a href="/assets/projects/concept-firewall/sudoku-source-LICENSE.txt" target="_blank" rel="noopener noreferrer">Data dedication</a>
        </div>
      </details>
    </div>
  );
}
