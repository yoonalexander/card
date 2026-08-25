# Alexander Yoon Portfolio

## Shared flower counter

The homepage flower counter uses [Abacus](https://github.com/jasonlovesdoggo/abacus) through the `/api/flowers` route. The shared counter lives at namespace `alexyoon.com` with key `flowers`; no local credentials are required.

## Vercel rewrites

The `/craveai/:path*` rewrite in `vercel.json` proxies requests to the separate CraveAI Vercel deployment at `https://crave-ai-eight.vercel.app`.

The `/cursora/:path*` rewrite proxies requests to the separate Cursora Vercel deployment at `https://cursora-woad.vercel.app`.

The `/xy-fight/:path*` rewrite proxies requests to the separate XY-Ball-Fight Vercel deployment at `https://xy-ball-fight.vercel.app`.
