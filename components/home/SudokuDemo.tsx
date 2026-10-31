"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { initialFrame, solveSudoku, sudokuPuzzles, type SearchFrame } from "./sudokuSolver";

export default function SudokuDemo() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [frame, setFrame] = useState(() => initialFrame(sudokuPuzzles[0].clues));
  const [running, setRunning] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [pace, setPace] = useState(110);
  const search = useRef<Generator<SearchFrame, void, unknown> | null>(null);
  const puzzle = sudokuPuzzles[puzzleIndex].clues;
  const filled = frame.board.filter(Boolean).length;
  const solved = frame.kind === "solved";
  const done = solved || frame.kind === "failed";
  const active = frame.index;
  const row = active === null ? null : Math.floor(active / 9);
  const column = active === null ? null : active % 9;

  const advance = useCallback((count = 1) => {
    if (!search.current) return;
    let latest: SearchFrame | undefined;
    for (let i = 0; i < count; i++) {
      const next = search.current.next();
      if (next.done) { setRunning(false); setFinishing(false); break; }
      latest = next.value;
      if (latest.kind === "solved" || latest.kind === "failed") {
        setRunning(false); setFinishing(false); break;
      }
    }
    if (latest) setFrame(latest);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => advance(finishing ? 64 : 1), finishing ? 16 : pace);
    return () => window.clearTimeout(timer);
  }, [running, finishing, pace, frame, advance]);

  useEffect(() => () => { search.current?.return(); }, []);

  function reset(nextIndex = puzzleIndex) {
    search.current?.return();
    search.current = null;
    setRunning(false);
    setFinishing(false);
    setPuzzleIndex(nextIndex);
    setFrame(initialFrame(sudokuPuzzles[nextIndex].clues));
  }

  function prepareSearch() {
    if (done) {
      search.current?.return();
      search.current = null;
      setFrame(initialFrame(puzzle));
    }
    if (!search.current) search.current = solveSudoku(puzzle);
  }

  const operation = frame.kind === "inspect" ? "Find the tightest choice" : frame.kind === "place" ? `Try ${frame.value} in this cell` :
    frame.kind === "remove" ? `Undo ${frame.value} and try another path` : frame.kind === "dead-end" ? "No number fits here" :
    solved ? "Every constraint checks out" : frame.kind === "failed" ? "No verified answer returned" : "One grid. Every constraint.";
  const description = frame.kind === "inspect" ? `Row ${row! + 1}, column ${column! + 1} has ${frame.candidates.length === 1 ? "only one possible number" : `${frame.candidates.length} possible numbers`}. The search chooses the empty cell with the fewest options.` :
    frame.kind === "place" ? "This number fits the current row, column and box. The search continues from this actual board state." :
    frame.kind === "remove" || frame.kind === "dead-end" ? "This branch cannot complete the puzzle. Backtracking removes a previous choice so the search can explore an alternative." :
    solved ? "The browser found this answer through exact search, then checked the original clues and all 27 rows, columns and boxes." :
    frame.kind === "failed" ? frame.reason : "Start the solver to see it examine candidates, place numbers and backtrack when a branch fails. Every move is computed here in your browser.";

  return (
    <div className={`sudoku-demo sudoku-live${solved ? " sudoku-live-complete" : ""}`}>
      <header className="sudoku-live-header">
        <div className="sudoku-live-eyebrow"><span className={running ? "sudoku-live-dot is-running" : "sudoku-live-dot"} /> Concept Firewall · live exact solver</div>
        <h3>Watch the puzzle come together.</h3>
        <p>Real search. Visible choices. A verified finish.</p>
      </header>

      <div className="sudoku-live-toolbar">
        <label>Puzzle<select aria-label="Sudoku puzzle" value={puzzleIndex} onChange={event => reset(Number(event.target.value))}>
          {sudokuPuzzles.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}
        </select></label>
        <label>Animation pace<select aria-label="Animation pace" value={pace} onChange={event => setPace(Number(event.target.value))}>
          <option value={260}>Slow</option><option value={110}>Normal</option><option value={20}>Fast</option>
        </select></label>
      </div>

      <div className="sudoku-demo-controls sudoku-live-controls">
        <button className="sudoku-demo-play" type="button" onClick={() => {
          if (running) { setRunning(false); setFinishing(false); }
          else { prepareSearch(); setRunning(true); }
        }}>{running ? "Pause" : done ? "Solve again" : frame.kind === "ready" ? "Solve live" : "Resume"}</button>
        <button type="button" disabled={running || done} onClick={() => { prepareSearch(); advance(); }}>Step</button>
        <button type="button" onClick={() => reset()}>Reset</button>
        {!done ? <button type="button" disabled={finishing} onClick={() => { prepareSearch(); setFinishing(true); setRunning(true); }}>{finishing ? "Finishing…" : "Finish search"}</button> : null}
      </div>

      <div className="sudoku-demo-main">
        <figure className="sudoku-demo-board-wrap">
          <div className="sudoku-live-board-frame">
            <table className="sudoku-demo-board" aria-label="Live Sudoku board">
              <tbody>{Array.from({ length: 9 }, (_, r) => (
                <tr key={r}>{Array.from({ length: 9 }, (_, c) => {
                  const index = r * 9 + c, value = frame.board[index], given = puzzle[index] !== "0";
                  const selected = active === index;
                  const related = active !== null && (r === row || c === column || (Math.floor(r / 3) === Math.floor(row! / 3) && Math.floor(c / 3) === Math.floor(column! / 3)));
                  const undo = selected && (frame.kind === "remove" || frame.kind === "dead-end");
                  const classes = ["sudoku-demo-cell", given ? "sudoku-demo-cell-given" : value ? "sudoku-demo-cell-filled" : "sudoku-demo-cell-empty",
                    related && !selected ? "sudoku-live-related" : "", selected ? "sudoku-live-active" : "", undo ? "sudoku-live-undo" : "", selected && frame.kind === "place" ? "sudoku-live-placed" : ""].filter(Boolean).join(" ");
                  return <td key={c} className={classes} data-value={value}
                    aria-label={`Row ${r + 1}, column ${c + 1}: ${value || "empty"}${given ? ", original clue" : ""}${selected ? ", active cell" : ""}`}>
                    <span aria-hidden="true" key={`${value}-${undo}`}>
                      {value || (undo && frame.value ? <s>{frame.value}</s> : selected && frame.kind === "inspect" ? <i className="sudoku-live-cursor" /> : "")}
                    </span>
                  </td>;
                })}</tr>
              ))}</tbody>
            </table>
          </div>
          <figcaption className="sudoku-demo-legend">
            <span><i className="sudoku-demo-given-key" /> Given</span>
            <span><i className="sudoku-live-active-key" /> Considering</span>
            <span><i className="sudoku-demo-filled-key" /> Placed</span>
            <span><i className="sudoku-live-undo-key" /> Backtrack</span>
          </figcaption>
        </figure>

        <div className="sudoku-demo-explanation sudoku-live-explanation">
          <p className={`sudoku-demo-status${solved ? " sudoku-live-verified" : ""}`} role="status">
            {solved ? "✓ Verified solution" : frame.kind === "failed" ? "Search stopped" : running ? "● Solving in your browser" : frame.kind === "ready" ? "Ready to solve" : "Paused"}
          </p>
          <h4>{operation}</h4>
          <p>{description}</p>
          {solved ? <ul className="sudoku-demo-checks">
            <li>✓ Original clues preserved</li><li>✓ All rows valid</li><li>✓ All columns valid</li><li>✓ All 3 × 3 boxes valid</li>
          </ul> : <div className="sudoku-live-candidates">
            <span>{active === null ? "Candidate numbers" : `Options · row ${row! + 1}, column ${column! + 1}`}</span>
            <div>{Array.from({ length: 9 }, (_, i) => i + 1).map(n => <b key={n} className={frame.candidates.includes(n) ? "is-possible" : ""}>{n}</b>)}</div>
            <small>{frame.kind === "ready" ? "Watch the options narrow as the grid fills." : "Highlighted numbers fit when this cell is selected."}</small>
          </div>}
          <div className="sudoku-live-stats" aria-label="Live search counters">
            <div><strong>{frame.nodes}</strong><span>Search nodes</span></div>
            <div><strong>{frame.placements}</strong><span>Placements</span></div>
            <div><strong>{frame.backtracks}</strong><span>Backtracks</span></div>
          </div>
        </div>
      </div>

      <div className="sudoku-live-progress">
        <div><span>{solved ? "All cells verified" : "Grid filled"}</span><strong>{filled} / 81</strong></div>
        <progress value={filled} max={81} aria-label="Cells filled in Sudoku grid" />
      </div>
      <p className="sudoku-demo-scope">Runs locally using a browser port of the CLI’s bounded exact-search algorithm. Animation is paced for clarity. No neural model or new research experiment.</p>
      <details className="sudoku-demo-evidence">
        <summary>Compare with the recorded Python CLI example</summary>
        <div>
          <a href="/assets/projects/concept-firewall/sudoku-demo.txt" target="_blank" rel="noopener noreferrer">Read transcript</a>
          <a href="/assets/projects/concept-firewall/sudoku-demo.json" target="_blank" rel="noopener noreferrer">Original JSON</a>
          <a href="/assets/projects/concept-firewall/sudoku-demo.cast" download>Download terminal recording</a>
        </div>
      </details>
    </div>
  );
}
