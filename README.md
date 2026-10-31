# Alexander Yoon Portfolio

## Completed research projects

The homepage Projects window includes Anytime NCM and Concept Firewall. Content
and evidence links live in `components/home/projectData.ts`; source visuals are
copied unchanged to `public/assets/projects/`. The legacy `projects.html` is not
the homepage's project listing.

- Anytime NCM uses its supplied website copy and case study. The architecture is
  labeled as an illustration; the separate results figure shows saved aggregate
  evidence. The entry retains the failed BLEU quality gate, conditional timing
  uncertainty, personal contribution and substantial AI-assistance disclosure.
- Concept Firewall keeps the initial probe chart distinct from later recovery
  findings. Its exact solver and CLI release are separate engineering outputs.
  Research reports, the CLI guide and integration verification are linked.

The primary Concept Firewall demo is a **recorded NCM research replay**. NCM predicts
positions in parallel within coarse-to-fine latent levels; decoded states cover the
whole board. The replay displays only four retained snapshots: the puzzle, the
level-6 cumulative-prefix decode, the original final output, and one selected retry
outcome. Whole-grid transitions show those snapshots together. Missing intermediate
levels and retry trajectories are not fabricated, and playback is not live inference
or a latency measurement.

Four curated alerting-original-failure examples cover both retries recovering, only
restart recovering, only fixed-prefix retry recovering, and neither recovering.
These are selected illustrations, not representative success rates. The methods
are alternative single potential retries at temperature 0.5, not consecutive retries
until success. The prefix method forces the original level-6 code prefix and
recomputes attention; full restart regenerates the entire hierarchy. The aggregate
finding of no established useful learned allocation advantage remains explicit.

`scripts/export-ncm-replay.py` reads the already exposed retained JSON tables and
checks their bytes against the research evidence inventory. It exports four small
examples and original line/source hashes, checks the original/retry outcomes, and
retains the public-domain puzzle-data dedication. It imports no model code, does no
fitting or inference, and writes no research artifacts or ledgers. Re-export with:

```powershell
python scripts/export-ncm-replay.py --project ..\Concept-Firewall
```

Run `npm.cmd run test:ncm` to check snapshot fidelity, all four outcome combinations,
constraint counts and the replay's stated boundaries. Its additional full-source
hash check runs when the original retained research tables are available locally;
ordinary portfolio checks do not require those ignored research artifacts.

The **Separate exact-solver CLI** tab runs a TypeScript port of the CLI's bounded,
deterministic minimum-remaining-values exact search. A generator advances the real
search one operation at a time, exposing candidate selection, placements, dead ends
and backtracking. It does not read a saved solution. The original CLI puzzle and a
harder backtracking example are selectable. Visitors can pause/resume, single-step,
change the animation pace, reset, or finish in bounded batches that yield to the UI.
Original clues stay fixed; the current row/column/box and active cell are highlighted.
New digits animate into place; rejected branches visibly undo their choices.

`sudokuSolver.ts` independently checks clues and all 27 completed units before a
solution is accepted. The default node budget is 100,000; invalid, unsatisfiable
and budget-exhausted searches return an explicit failure. Search counters reflect
actual work; animation timing is deliberately paced, not an execution benchmark.
Reduced-motion preferences disable decorative effects, and the demo starts paused.
Run `npm.cmd run test:sudoku` for algorithm, trace, cancellation, verifier and budget
checks. The classic board and node count match the recorded Python CLI example.

The original terminal evidence remains available in a collapsed disclosure and
the project evidence links: stdout JSON, transcript, 15-second `.cast` recording,
capture/source hashes and provenance receipt. Integer arrays in the terminal replay
are compacted without changing values; its timing is paced for readability and
does not depict execution latency. This is the separate classical exact-solving
deliverable; no model or research experiment runs in the website.

To recapture from a local Concept Firewall checkout with CLI 0.2.0 installed:

```powershell
python scripts/record-concept-firewall-demo.py --python ..\Concept-Firewall\.venv\Scripts\python.exe
```

Pass `--project PATH` if the research checkout is not a sibling folder.
Validate site changes with `npm.cmd run build` and inspect the Projects window
using `npm.cmd run start` (or `npm.cmd run dev`).

## Shared flower counter

The homepage flower counter uses [Abacus](https://github.com/jasonlovesdoggo/abacus) through the `/api/flowers` route. The shared counter lives at namespace `alexyoon.com` with key `flowers`; no local credentials are required.

## Vercel rewrites

The `/craveai/:path*` rewrite in `vercel.json` proxies requests to the separate CraveAI Vercel deployment at `https://crave-ai-eight.vercel.app`.

Cursora is hosted at `https://cursora.alexyoon.com`. Permanent redirects send the old `/cursora` and `/cursora/:path*` URLs to the subdomain, preserving nested paths and query strings. The portfolio links directly to the subdomain and excludes the old redirected URL from its sitemap.

The `/xy-fight/:path*` rewrite proxies requests to the separate XY-Ball-Fight Vercel deployment at `https://xy-ball-fight.vercel.app`.
