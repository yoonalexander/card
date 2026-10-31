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

Concept Firewall's visual demo shows the original Sudoku clues, the rejected blank
proposal, and the solved board with constraint checks. Dark given cells retain the
original clues; green cells show values filled by exact search; crosses identify
clues omitted from the rejected proposal. Visitors can select each step, play or
pause the walkthrough, and jump to the solution. `SudokuDemo.tsx` uses the puzzle
from `examples/sudoku_demo.py` and the recorded CLI 0.2.0 JSON directly. It shows
saved outcomes, not a live solver or an intermediate search trace.

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
