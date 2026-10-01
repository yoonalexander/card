# Alexander Yoon Portfolio

## Shared flower counter

The homepage flower counter uses [Abacus](https://github.com/jasonlovesdoggo/abacus) through the `/api/flowers` route. The shared counter lives at namespace `alexyoon.com` with key `flowers`; no local credentials are required.

## Vercel rewrites

The `/craveai/:path*` rewrite in `vercel.json` proxies requests to the separate CraveAI Vercel deployment at `https://crave-ai-eight.vercel.app`.

Cursora is hosted at `https://cursora.alexyoon.com`. Permanent redirects send the old `/cursora` and `/cursora/:path*` URLs to the subdomain, preserving nested paths and query strings. The portfolio links directly to the subdomain and excludes the old redirected URL from its sitemap.

The `/xy-fight/:path*` rewrite proxies requests to the separate XY-Ball-Fight Vercel deployment at `https://xy-ball-fight.vercel.app`.
