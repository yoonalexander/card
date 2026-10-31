"""Capture the supplied Sudoku example without loading a model or running research.

Run from Card: python scripts/record-concept-firewall-demo.py --python PATH
PATH must be a Python environment with Concept Firewall CLI 0.2.0 installed.
The cast preserves the captured JSON values, compacts integer arrays, and retimes
output for reading. It does not claim to show the solver's execution latency.
"""

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import subprocess
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--python", required=True, type=Path)
    parser.add_argument("--project", type=Path)
    args = parser.parse_args()
    card = Path(__file__).resolve().parents[1]
    project = (args.project or card.parent / "Concept-Firewall").resolve()
    interpreter = args.python.resolve()
    source = project / "examples" / "sudoku_demo.py"
    destination = card / "public/assets/projects/concept-firewall"
    destination.mkdir(parents=True, exist_ok=True)

    version = subprocess.check_output(
        [str(interpreter), "-m", "concept_firewall", "--version"], cwd=project, text=True
    ).strip()
    if version != "concept-firewall 0.2.0":
        raise RuntimeError(f"Expected CLI 0.2.0, got {version}")
    started = time.perf_counter()
    process = subprocess.run(
        [str(interpreter), str(source)], cwd=project, text=True,
        capture_output=True, check=True,
    )
    elapsed = time.perf_counter() - started
    payload = json.loads(process.stdout)
    assert payload["rejected_proposal"]["is_valid"] is False
    assert payload["exact_fallback"]["verified"] is True
    assert payload["exact_fallback"]["used_fallback"] is True
    assert payload["exact_fallback"]["status"] == "solved_exact"
    assert payload["rechecked_completion"]["is_valid"] is True
    assert "".join(map(str, payload["rechecked_completion"]["board"])) == payload["exact_fallback"]["board"]

    # Whitespace-only formatting: all recorded JSON fields and values survive.
    formatted = re.sub(
        r"\[\s+(?:\d+,\s+)*\d+\s+\]",
        lambda match: json.dumps(json.loads(match[0]), separators=(",", ":")),
        process.stdout.strip(),
    )
    assert json.loads(formatted) == payload
    summary = (
        "\n# Captured result: incomplete proposal rejected; exact fallback solved\n"
        f"# in {payload['exact_fallback']['search_nodes']} search nodes; completion rechecked valid.\n"
        "# Classical exact solving; no learned model used.\n"
    )
    prompt = "$ python examples/sudoku_demo.py\n"
    transcript = prompt + formatted + "\n" + summary
    events = [[0.0, "o", prompt]]
    at = 1.2
    for line in (formatted + "\n" + summary).splitlines(keepends=True):
        events.append([round(at, 2), "o", line.replace("\n", "\r\n")])
        at += 0.28 if len(line) < 100 else 0.8
    captured = datetime.now(timezone.utc)
    source_commit = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=project, text=True
    ).strip()
    receipt = {
        "captured_at": captured.isoformat(),
        "command": "python examples/sudoku_demo.py",
        "version": version,
        "source_commit": source_commit,
        "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "exit_code": process.returncode,
        "observed_process_seconds": round(elapsed, 6),
        "scope": "One supplied example, no models, no research experiments; not a benchmark.",
        "presentation": "Recorded stdout with integer arrays compacted; playback retimed for readability, not execution speed.",
    }
    files = {
        "sudoku-demo.json": process.stdout,
        "sudoku-demo.txt": transcript,
        "sudoku-demo.cast": "\n".join(json.dumps(row) for row in [
            {"version": 2, "width": 90, "height": 28, "timestamp": int(captured.timestamp()),
             "title": "Concept Firewall 0.2.0: verify, exact solve, recheck", "env": {"TERM": "dumb"},
             "duration": round(at + 1, 2), "recording": receipt},
            *events,
        ]) + "\n",
    }
    receipt["files"] = {}
    for filename, content in files.items():
        raw = content.encode("utf-8")
        (destination / filename).write_bytes(raw)
        receipt["files"][filename] = {"sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw)}
    (destination / "recording-receipt.json").write_bytes((json.dumps(receipt, indent=2) + "\n").encode("utf-8"))
    print(json.dumps({"version": version, "exit_code": process.returncode, "playback_seconds": round(at + 1, 2), "files": list(files)}))


if __name__ == "__main__":
    main()
