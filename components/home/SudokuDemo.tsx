"use client";

import { useEffect, useState } from "react";
import recorded from "../../public/assets/projects/concept-firewall/sudoku-demo.json";

// Original clues from Concept-Firewall/examples/sudoku_demo.py. The proposal,
// solution and verification below come from its retained CLI output.
const puzzle = "530070000600195000098000060800060003400803001700020006060000280000419005000080079";
const clues = [...puzzle].filter((cell) => cell !== "0").length;
const solution = recorded.exact_fallback.board;
const steps = [
  { label: "Puzzle", title: "Start with the original clues", status: `${clues} given numbers`,
    description: "Keep the given numbers. Fill the empty cells so every row, column and 3 × 3 box contains 1–9." },
  { label: "Rejected", title: "An empty answer fails the check", status: "Proposal rejected",
    description: `The demo submits a blank answer. All 81 cells are empty and ${recorded.rejected_proposal.clue_violations} original clues are missing, so the verifier rejects it.` },
  { label: "Verified", title: "Solve, then check the answer", status: "Verified completion",
    description: `Exact search fills the ${81 - clues} missing numbers from the original puzzle. The CLI then rechecks the completed board before returning it.` },
] as const;

export default function SudokuDemo() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = steps[step];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (step === steps.length - 1) setPlaying(false);
      else setStep((value) => value + 1);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  function showStep(next: number) {
    setPlaying(false);
    setStep(next);
  }

  return (
    <div className={`sudoku-demo sudoku-demo-step-${step}`}>
      <div className="sudoku-demo-heading">
        <p className="sudoku-demo-kicker">Concept Firewall · Sudoku CLI 0.2.0</p>
        <h3>From puzzle to verified answer</h3>
        <p>Recorded exact-solving example · no learned model.</p>
      </div>

      <ol className="sudoku-demo-steps" aria-label="Walkthrough steps">
        {steps.map((item, index) => (
          <li key={item.label}>
            <button type="button" aria-pressed={index === step} onClick={() => showStep(index)}>
              <span aria-hidden="true">{index + 1}</span> {item.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="sudoku-demo-main">
        <figure className="sudoku-demo-board-wrap">
          <table className="sudoku-demo-board" aria-label={`${current.label} Sudoku board`}>
            <tbody>
              {Array.from({ length: 9 }, (_, row) => (
                <tr key={row}>
                  {Array.from({ length: 9 }, (_, column) => {
                    const index = row * 9 + column;
                    const given = puzzle[index] !== "0";
                    const value = step === 2 ? solution[index] : step === 1 ? recorded.rejected_proposal.board[index] : Number(puzzle[index]);
                    const missing = step === 1 && given;
                    const filled = step === 2 && !given;
                    const state = missing ? "missing" : given ? "given" : filled ? "filled" : "empty";
                    return (
                      <td key={column} className={`sudoku-demo-cell sudoku-demo-cell-${state}`}
                        aria-label={`Row ${row + 1}, column ${column + 1}: ${missing ? `missing original clue ${puzzle[index]}` : value === 0 || value === "0" ? "empty" : `${value}${given ? ", original clue" : ", solved value"}`}`}>
                        <span aria-hidden="true">{missing ? "×" : value === 0 || value === "0" ? "" : value}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <figcaption className="sudoku-demo-legend">
            {step === 1 ? <span><b className="sudoku-demo-missing-key">×</b> Missing original clue</span> : (
              <>
                <span><i className="sudoku-demo-given-key" /> Original clues</span>
                {step === 2 ? <span><i className="sudoku-demo-filled-key" /> Solved values</span> : null}
              </>
            )}
          </figcaption>
        </figure>

        <div className="sudoku-demo-explanation" aria-live="polite" aria-atomic="true">
          <p className="sudoku-demo-status">{step === 1 ? "× " : step === 2 ? "✓ " : ""}{current.status}</p>
          <h4>{current.title}</h4>
          <p>{current.description}</p>
          {step === 2 ? (
            <>
              <ul className="sudoku-demo-checks">
                <li>✓ Original clues preserved</li>
                <li>✓ All rows valid</li>
                <li>✓ All columns valid</li>
                <li>✓ All 3 × 3 boxes valid</li>
              </ul>
              <p className="sudoku-demo-search">{recorded.exact_fallback.search_nodes} search nodes · {recorded.rechecked_completion.filled_cells}/81 cells verified</p>
            </>
          ) : <p className="sudoku-demo-aside">{step === 1 ? "The solver returns to the original puzzle; a rejected proposal never becomes extra clues." : "The finished answer must pass every constraint before it is accepted."}</p>}
        </div>
      </div>

      <div className="sudoku-demo-controls">
        <button className="sudoku-demo-play" type="button" onClick={() => {
          if (step === steps.length - 1 && !playing) setStep(0);
          setPlaying((value) => !value);
        }}>{playing ? "Pause" : step === steps.length - 1 ? "Replay" : "Play walkthrough"}</button>
        <button type="button" onClick={() => showStep(step === steps.length - 1 ? 0 : step + 1)}>
          {step === steps.length - 1 ? "Start again" : "Next step"}
        </button>
        {step < 2 ? <button type="button" onClick={() => showStep(2)}>Show solution</button> : null}
      </div>

      <p className="sudoku-demo-scope">Classical exact-solving tool; no learned model. Saved results shown in explanatory steps, without a live search trace.</p>
      <details className="sudoku-demo-evidence">
        <summary>View recorded CLI evidence</summary>
        <div>
          <a href="/assets/projects/concept-firewall/sudoku-demo.txt" target="_blank" rel="noopener noreferrer">Read transcript</a>
          <a href="/assets/projects/concept-firewall/sudoku-demo.json" target="_blank" rel="noopener noreferrer">Original JSON</a>
          <a href="/assets/projects/concept-firewall/sudoku-demo.cast" download>Download terminal recording</a>
        </div>
      </details>
    </div>
  );
}
