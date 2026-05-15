# Universidades México

[![Deploy](https://github.com/redcpp/universidades-nuxt/actions/workflows/deploy.yml/badge.svg)](https://github.com/redcpp/universidades-nuxt/actions/workflows/deploy.yml)
[![Live](https://img.shields.io/badge/live-universidades--mexico.pages.dev-3b82f6?logo=cloudflare&logoColor=white)](https://universidades-mexico.pages.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)

Searchable directory of **3,467 universities** and **27,798 degree programs** in Mexico — fully static, served from Cloudflare's edge with instant fuzzy search.

🔗 **[Live demo → universidades-mexico.pages.dev](https://universidades-mexico.pages.dev)**

![OG Image](public/og-image.png)

## Screenshots

| Landing | Search |
|---|---|
| ![Landing](public/screenshots/landing.png) | ![Search](public/screenshots/buscador.png) |

| University profile | Mobile |
|---|---|
| ![University](public/screenshots/universidad.png) | ![Mobile](public/screenshots/mobile.png) |

## What's new (May 2026)

The UI was rewritten from first principles into a light-only "Operator's Console" identity (Linear/Stripe-grade refinement, monospace data, restrained accent, map as protagonist). New capabilities:

- **⌘K command palette** — global fuzzy search across universities, programs, and states.
- **Density choropleth toggle** — the homepage map recolors live across four metrics (universities, programs, programs-per-university, % public).
- **`/carrera/[slug]` route** — every unique program now has its own pre-rendered page with a mini-choropleth showing where it's offered.

See `docs/superpowers/specs/2026-05-11-cinematic-ui-redesign-design.md` and `docs/superpowers/plans/2026-05-11-cinematic-ui-redesign.md` for the full design and implementation.

## Highlights

- **22,000+ static pages** pre-rendered in ~20 seconds — every state, university, and unique degree program gets its own indexable URL.
- **Zero backend.** Search runs entirely client-side with Fuse.js (~10 KB) over a single JSON blob.
- **Edge-hosted** on Cloudflare Pages: free, global CDN, automatic HTTPS.
- **Interactive map** of Mexico (custom inline SVG) with hover tooltips and per-state navigation.
- **CI/CD** via GitHub Actions — every push to `main` rebuilds and deploys.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (SSG mode) | Static generation, SEO-friendly routing, Vue 3 DX |
| Styling | [Tailwind CSS](https://tailwindcss.com) | Utility-first, fast iteration, small bundle |
| Search | [Fuse.js](https://fusejs.io) | Typo-tolerant fuzzy search, no server required |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | Free global edge, instant cache invalidation |
| Tests | [Vitest](https://vitest.dev) + [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing) | Component testing with happy-dom |

## Migration from Django

This project is a rewrite of a legacy Django 1.11 app. Notable changes:

| Aspect | Before (Django) | After (Nuxt 3) |
|---|---|---|
| Backend | Django + SQLite | None — fully static |
| Frontend | jQuery + UIkit | Vue 3 + Tailwind |
| Map | CSSMap plugin (26 MB of sprites) | Inline SVG (~73 KB) |
| Search | NLTK + DB queries | Fuse.js client-side |
| Hosting | None | Cloudflare Pages (free) |
| Deploy | Manual | `git push` → GitHub Actions |

## Why this architecture?

The dataset (universities and degree programs) is fundamentally **read-mostly and rarely changes**. SSG lets us:

1. Eliminate server costs and the operational surface area that comes with them.
2. Maximize SEO — every university gets a pre-rendered, cacheable URL.
3. Serve from a free global CDN with sub-100 ms TTFB anywhere.

Fuse.js was chosen for search because the entire dataset (3.5 MB of JSON) is small enough to ship to the client, which yields zero-latency search after first load — no roundtrips, no backend to scale.

## Commands

```bash
npm install         # Install dependencies
npm run dev         # Local dev server
npm run generate    # Build static site to .output/public
npm run preview     # Preview the generated build
npm test            # Run component tests
npm run deploy      # Generate + deploy to Cloudflare Pages
```

## Deployment

Automatic on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Required GitHub Actions secrets:
- `CLOUDFLARE_API_TOKEN` — token with *Cloudflare Pages: Edit* permission.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.

Manual deploys: `npm run deploy` (requires `wrangler login`).

## Data

- **33** Mexican states · **3,467** universities · **27,798** degree programs.
- Source: Secretaría de Educación Pública (SEP).
- Exported once from `db.sqlite3` to `public/data/universidades.json`. The original SEP scraper is discontinued, so the dataset is a historical snapshot.

## License

[MIT](LICENSE)
