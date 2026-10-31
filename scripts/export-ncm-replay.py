"""Export four curated, already exposed NCM runs for a portfolio replay.

Reads retained JSON only. No model loads, fitting, inference or ledger writes.
Whole-grid snapshots are not invented or interpolated. The two retry methods
are alternative potential outcomes, not successive retries until success.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def cells(text):
    if not re.fullmatch(r"[0-9]{81}|[0-9]{9}(?:\|[0-9]{9}){8}", text):
        raise ValueError("Cannot display this snapshot as an 81-cell board")
    return text.replace("|", "")


def valid(puzzle, board):
    if "0" in board or any(p != "0" and p != b for p, b in zip(puzzle, board)):
        return False
    for i in range(9):
        units = [board[i*9:i*9+9], board[i::9],
                 "".join(board[(i//3*3+j//3)*9+i%3*3+j%3] for j in range(9))]
        if any(set(unit) != set("123456789") for unit in units):
            return False
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path)
    args = parser.parse_args()
    card = Path(__file__).resolve().parents[1]
    project = (args.project or card.parent / "Concept-Firewall").resolve()
    inventory = json.loads((project / "results/continuation/evidence_inventory.json").read_bytes())
    expected = {item["path"]: item for item in inventory["files"]}
    names = {"original": "confirmation", "prefix": "level6_fixed_prefix_stochastic_suffix", "restart": "full_stochastic_restart"}
    tables, sources, line_hashes = {}, {}, {}
    for key, name in names.items():
        relative = f"results/continuation/raw/{name}.jsonl"
        raw = (project / relative).read_bytes()
        if digest(raw) != expected[relative]["sha256"] or len(raw) != expected[relative]["bytes"]:
            raise ValueError(f"Retained source differs from audited inventory: {relative}")
        rows = [json.loads(line) for line in raw.splitlines()]
        tables[key] = {row["puzzle_id"]: row for row in rows}
        line_hashes[key] = {row["puzzle_id"]: digest(line) for row, line in zip(rows, raw.splitlines())}
        sources[key] = {"path": relative, "sha256": digest(raw), "bytes": len(raw)}

    cases = []
    for prefix_ok, restart_ok, label in [
        (True, True, "Both retries recover"),
        (False, True, "Only restart recovers"),
        (True, False, "Only prefix retry recovers"),
        (False, False, "Neither retry recovers"),
    ]:
        eligible = sorted(pid for pid, row in tables["original"].items()
                          if row["alert"] and row["y"] == 1
                          and tables["prefix"][pid]["retry_valid"] == prefix_ok
                          and tables["restart"][pid]["retry_valid"] == restart_ok)
        pid = eligible[0]
        original = tables["original"][pid]
        puzzle, current, final = map(cells, [original["puzzle"], original["current_board"], original["final_board"]])
        if valid(puzzle, final) or original["y"] != 1:
            raise ValueError("Selected original is not a verified failure")
        retries = {}
        for method in ["prefix", "restart"]:
            row = tables[method][pid]
            board = cells(row["retry_board"])
            if valid(puzzle, board) != row["retry_valid"]:
                raise ValueError("Retry disagrees with independent constraint check")
            retries[method] = {"board": board, "valid": row["retry_valid"]}
        cases.append({"id": pid, "label": label, "puzzle": puzzle, "level6": current, "final": final,
                      "warning": {"score": original["score"], "alert": original["alert"]}, "retries": retries,
                      "source_line_sha256": {key: line_hashes[key][pid] for key in names}})

    payload = {
        "schema_version": 1,
        "kind": "recorded_ncm_research_replay",
        "scope": "Four curated examples from the already exposed 1,600-puzzle recovery cohort; not representative success rates or fresh confirmation.",
        "selection": "First puzzle identity in sorted order in each alerting-original-failure / two-retry-outcome combination.",
        "snapshots": "Original puzzle, recorded level-6 cumulative-prefix reconstruction, original final output, and one chosen recorded retry outcome. Intermediate levels and retry trajectories are not retained here or fabricated.",
        "retry_design": "Alternative single potential retries at temperature 0.5, not sequential retries until success. Prefix method forces the original level-6 code prefix and recomputes attention; restart generates a new complete hierarchy.",
        "research_finding": "No established useful learned recovery-allocation advantage; exact solving is a separate engineering deliverable.",
        "model_execution_during_export": False,
        "sources": sources,
        "dataset": {"name": "Sudoku Exchange Puzzle Bank", "url": "https://github.com/grantm/sudoku-exchange-puzzle-bank", "rights": "Public-domain dedication retained in sudoku-source-LICENSE.txt"},
        "cases": cases,
    }
    destination = card / "public/assets/projects/concept-firewall"
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "ncm-replay.json").write_bytes((json.dumps(payload, indent=2) + "\n").encode())
    (destination / "sudoku-source-LICENSE.txt").write_bytes((project / "data/v2/source/LICENSE.txt").read_bytes())
    print(json.dumps({"cases": len(cases), "source_hashes": "matched audited inventory", "new_model_calls": 0,
                      "outcomes": [{"label": c["label"], "prefix": c["retries"]["prefix"]["valid"], "restart": c["retries"]["restart"]["valid"]} for c in cases]}))


if __name__ == "__main__":
    main()
