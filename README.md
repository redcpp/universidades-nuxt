# Universidades México

[![Deploy](https://github.com/redcpp/universidades-nuxt/actions/workflows/deploy.yml/badge.svg)](https://github.com/redcpp/universidades-nuxt/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/live-universidades--mexico.pages.dev-3b82f6?logo=cloudflare&logoColor=white)](https://universidades-mexico.pages.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)

A searchable directory of **3,467 universities** and **27,798 degree programs** in Mexico — fully static, served from Cloudflare's edge, with instant client-side fuzzy search.

🔗 **[Live demo → universidades-mexico.pages.dev](https://universidades-mexico.pages.dev)**

![OG Image](public/og-image.png)

## Screenshots

| Landing | Search |
|---|---|
| ![Landing](public/screenshots/landing.png) | ![Search](public/screenshots/buscador.png) |

| University profile | Mobile |
|---|---|
| ![University](public/screenshots/universidad.png) | ![Mobile](public/screenshots/mobile.png) |

## At a glance

- **~22,000 static pages** pre-rendered in ~20 seconds — every state, university, and unique degree program has its own indexable URL.
- **Zero backend.** Search runs entirely client-side with Fuse.js (~10 KB) over a single JSON blob.
- **Edge-hosted** on Cloudflare Pages: free, global CDN, automatic HTTPS, sub-100 ms TTFB.
- **Interactive choropleth map** of Mexico (inline SVG, ~73 KB) with live density toggle across four metrics.
- **⌘K command palette** for fuzzy search across universities, programs, and states.
- **CI/CD** via GitHub Actions — every push to `main` rebuilds and deploys.

## Why this architecture

The dataset is read-mostly and rarely changes, so SSG buys real wins:

1. **No server, no operational surface.** No DB to back up, no app to patch, no autoscaling to tune.
2. **SEO by default.** Every university and degree program is a pre-rendered URL that Google can index directly.
3. **Free global edge.** Cloudflare Pages serves the whole site from cache, anywhere, for $0.

Fuse.js is small enough (~10 KB) and the dataset compact enough (~3.5 MB JSON) to ship the entire search index to the client. After the first load, search has zero network roundtrips — no backend to scale, no rate limits, no cold starts.

## Migration from Django

This is a rewrite of a legacy Django 1.11 + jQuery app:

| Aspect | Before (Django) | After (Nuxt 3) |
|---|---|---|
| Backend | Django + SQLite | None — fully static |
| Frontend | jQuery + UIkit | Vue 3 + Tailwind |
| Map | CSSMap plugin (26 MB of sprites) | Inline SVG (~73 KB) |
| Search | NLTK + DB queries | Fuse.js client-side |
| Hosting | None (local-only) | Cloudflare Pages (free) |
| Deploy | Manual | `git push` → GitHub Actions |

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (SSG mode) | Static generation, SEO-friendly routing, Vue 3 DX |
| Styling | [Tailwind CSS](https://tailwindcss.com) | Utility-first, fast iteration, small bundle |
| Search | [Fuse.js](https://fusejs.io) | Typo-tolerant fuzzy search, no server required |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | Free global edge, instant cache invalidation |
| Tests | [Vitest](https://vitest.dev) + [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) | Component testing with happy-dom |

## Engineering notes

A few decisions worth calling out:

- **Hover highlight on the map.** Each Mexican state is a `<path>` in document order. When a state is hovered, its accent border can be visually covered by neighbouring states that appear later in the SVG (e.g. Hidalgo, surrounded by Edomex/Puebla/Veracruz). Solution: on `mouseenter`, clone the path's `d` into an overlay `<path fill=accent stroke=accent>` appended to the root `<svg>` with `pointer-events: none`. The overlay paints last, so the accent isn't obscured, and the original path still owns the cursor — `mouseleave` fires reliably. See [`components/MexicoMap.vue`](components/MexicoMap.vue).
- **Carrera slug deduplication.** The raw SEP dataset contains the same program under slight name variations across institutions. The static-build script normalises and deduplicates 27k programs down to ~7.5k unique slugs and generates one canonical `/carrera/[slug]` page per program. See [`scripts/build-carrera-index.mjs`](scripts/build-carrera-index.mjs).
- **No payload extraction.** Nuxt's default static payload generation creates one JSON file per route; with ~22k routes this blew past Cloudflare Pages' 20k-file limit. Disabling payload extraction in [`nuxt.config.ts`](nuxt.config.ts) trades a small first-paint cost for staying under the limit.

## Commands

This project uses **pnpm** and Node 22.

```bash
pnpm install         # Install dependencies
pnpm dev             # Local dev server
pnpm generate        # Build static site to .output/public
pnpm preview         # Preview the generated build
pnpm test            # Run component tests
pnpm deploy          # Generate + deploy to Cloudflare Pages
```

## Deployment

Automatic on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Required GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN` — token with *Cloudflare Pages: Edit* permission.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.

Manual deploys: `pnpm deploy` (requires `wrangler login`).

## Data

- **33** Mexican states · **3,467** universities · **27,798** degree programs.
- Source: Secretaría de Educación Pública (SEP).
- Exported once from `db.sqlite3` to `public/data/universidades.json`. The original SEP scraper is discontinued, so the dataset is a historical snapshot.

## License

[MIT](LICENSE)
