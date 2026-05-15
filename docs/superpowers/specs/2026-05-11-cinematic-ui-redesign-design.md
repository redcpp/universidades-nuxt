# universidades-nuxt — Cinematic UI/UX Redesign (Operator's Console)

**Date:** 2026-05-11
**Status:** Design approved, ready for implementation plan
**Author:** Diego Said Anaya Mancilla (with Claude)

---

## 1. Goal

Rebuild the UI/UX of universidades-nuxt from first principles so the project (a) carries portfolio weight for an Applied AI / Forward-Deployed Engineering role and (b) makes the map of Mexico the protagonist of the experience, not a decorative section. The current design is competent but generic ("modern SaaS template" with hero blobs and gradient cards) — it does not differentiate the project on a resume.

The visual identity is **Operator's Console, light-only refined**: Linear/Stripe/Notion-grade refinement, monospace data labels, restrained color, generous typography, dense where data lives, breathing where it doesn't. The map is the central instrument. Everything else orbits it.

## 2. Non-goals

- No theme toggle. Light-only by deliberate choice — one identity, one set of tokens, one QA surface.
- No backend, no SSR-on-request, no auth. The site remains fully static (SSG → Cloudflare Pages).
- No new data sources. Same `universidades.json` (3.5 MB) shipped to the client; same `mexico.svg` for the map geometry.
- No dependency-heavy mapping libraries (Mapbox, Leaflet, deck.gl). The inline SVG approach is preserved because it is part of the project's character.
- No mobile-first re-architecture of the operator console — the dense data layout is desktop-first, with a clean stacked fallback on small screens.

## 3. Visual identity

### 3.1 Aesthetic anchor

Reference points (in priority order): **Linear marketing site**, **Stripe homepage**, **Notion**, **Vercel Observability dashboards**, **Cron calendar (now Notion Calendar)**. The common thread: light surface, ink-deep type, one disciplined accent, monospace numbers, hairline rules, motion that exists but never performs.

### 3.2 Color tokens

```
--paper       #FAFAF7   page background (warm off-white, not pure)
--surface     #FFFFFF   raised cards
--ink         #0A0A0A   primary text
--ink-2       #2A2A2A   secondary text
--ink-3       #6B6B6B   tertiary / metadata
--ink-4       #B5B5B0   disabled / placeholder
--hairline    #E7E5E0   1px rules, dividers, card borders
--hairline-2  #F0EEE8   subtler rules (table zebra, inactive states)
--accent      #C2410C   single warm ink (burnt sienna) — used sparingly
--accent-soft #FDF4EE   accent tint for hover backgrounds, selected states
--data-0      #F0EEE8   choropleth low (lightest)
--data-1      #E5DCC8
--data-2      #D2BFA0
--data-3      #B89876
--data-4      #8A6B43   choropleth high (darkest, near accent)
```

Rationale for the warm palette (not pure neutral gray): a slightly warm paper background reads as editorial / print-craft (think the Economist, NYT magazine), which differentiates from the cool slate/blue convention used by 90% of SaaS landing pages. The accent is a single warm earth tone — never blue, never violet — so the page does not read as "another React template."

### 3.3 Typography

- **Display & body:** `Inter` (already in the project), but used with tighter tracking and a stronger hierarchy than the current design. Display sizes use `-0.04em` tracking and `font-feature-settings: "ss01", "cv11"`.
- **Numerals & code:** `JT Mono` fallback `JetBrains Mono` fallback `ui-monospace`. All counts, percentages, identifiers, breadcrumb indices, and state codes render in mono with `tabular-nums`. This single move does more for the "operator's console" feel than any other choice.
- **Serif accent (optional, used for one element):** the index page hero kicker ("A directory of every Mexican university.") uses `Source Serif 4` italic, 22px, for editorial contrast. Used in exactly **one** place — anywhere else cheapens it.

Type scale (rem):
```
display-1  4.5    (homepage hero only)
display-2  3.0    (page titles)
h1         2.0
h2         1.5
h3         1.125
body       0.9375 (15px)
small      0.8125 (13px)
mono-data  0.875  with tabular-nums
mono-meta  0.75   uppercase tracking 0.08em
```

### 3.4 Layout primitives

- **Hairline grid:** 1px `--hairline` rules separate logical regions instead of card shadows. Cards are flat with hairline borders, not floating. Shadow is used only for the active-state surface (hover panel, command palette modal) and is always single-layer, soft (`0 8px 32px -8px rgba(0,0,0,0.08)`).
- **Container:** max-width 1280px on operator views, 720px on prose views.
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px. No arbitrary values.
- **Border radius:** 6px (small chips), 10px (cards), 14px (modals). No fully-rounded pills except for state-density legend swatches.

### 3.5 Motion

Motion budget: **subtract, do not add**. Three motion primitives, used everywhere, consistent:
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` — for entrances, hover lifts, panel slides.
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)` — for state changes (density toggle).
- Durations: 120ms (micro), 200ms (UI), 400ms (panel), 600ms (page entrance). Never longer.

Choropleth recolor on density-toggle uses a staggered 600ms transition (`transition: fill var(--ease-in-out) 400ms`, each state offset by ~5ms based on its DOM index) so the map appears to "breathe" into the new view. This is the single piece of cinematic motion on the page — it does the storytelling.

## 4. Page-by-page redesign

### 4.1 Index (`/`) — The Console

Replaces the current hero+blobs+stats+map+state-grid stack with a single full-viewport console.

```
┌─ Universidades MX ──────────────────────────────────────────────────────┐
│  ⌘K  Buscar universidades, carreras, estados                32 estados  │  ← top bar (fixed)
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   A directory of every                  ┌──────────────────────────┐   │
│   Mexican university.                   │                          │   │
│                                         │      MAPA  MÉXICO        │   │
│   3,467  instituciones                  │   (choropleth, density)  │   │
│   27,798 carreras                       │                          │   │
│                                         │                          │   │
│   density:  [ universidades  ▾ ]        │                          │   │
│                                         │                          │   │
│   ─────────────────────────────         │                          │   │
│   TOP 10 ESTADOS                        │                          │   │
│                                         │                          │   │
│   01  Estado de México         420      │                          │   │
│   02  CDMX                     387      │                          │   │
│   03  Jalisco                  289      │                          │   │
│   ...                                   └──────────────────────────┘   │
│                                                                          │
│   Datos SEP · sitio estático · MIT       Compare states  →             │
└─────────────────────────────────────────────────────────────────────────┘
```

Behavior:
- The map occupies ~60% of viewport width on desktop, full bleed on mobile (where it stacks below the KPI column).
- Hover on a state: subtle lift (translate-y -1px, fill darkens by one data step, hairline ring appears in accent color), tooltip-less; instead, a **side panel slides in from the right** of the map containing { state name, total universities, total carreras, top 3 universities, density rank }. The panel is sticky-positioned so it does not push layout. Clicking the state navigates to `/estado/[id]`.
- The density dropdown switches the choropleth between four modes: { universities, carreras, carreras-per-university ratio, % public }. The transition is the cinematic motion piece (§3.5).
- Top-10 leaderboard reflects the active density mode and updates in lockstep with the map.
- No animated blobs, no glass effects, no gradient hero. The cinematic quality comes from typography, hairlines, and one purposeful motion — not decoration.

### 4.2 Buscador (`/buscador`)

Refined search-only page. Removed: dark gradient hero, "tarjeta" search bar. Replaced with:
- Clean light page, page title `Buscador` in display-2, kicker `Encuentra entre 3,467 universidades y 27,798 carreras.` in `--ink-3`.
- Search input is a single hairline-bordered field with a leading kbd hint (`⌘K`). Typing filters in real time.
- Results render in two columns on desktop: universities (left), carreras (right). Each result is a hairline row, not a card. Hover: row background → `--accent-soft`, accent left-rule appears.
- Empty state: a tasteful single-sentence prompt in `--ink-3`. No giant centered icon.

The same Fuse.js indices used by the command palette power this page — single source of truth.

### 4.3 Estado (`/estado/[id]`)

Drill-down for a single state. New layout:
- Breadcrumb in mono-meta, hairline beneath.
- Page title is the state name in display-2; subtitle shows `{count} universidades · {carreras} carreras · {ratio} carreras/uni` in mono.
- **Micro-map**: the state's path extracted from the Mexico SVG, rendered at large scale on the right side of the hero, in `--accent` fill at 40% opacity. Static visual anchor — confirms place.
- Filter pills (Pública / Privada / Mixta / Todos) rendered as hairline chips, not pill buttons.
- University list as hairline rows (not cards). Each row: type chip (mono-meta), name (body), URL hostname (small, `--ink-3`), `→` glyph aligned right. Hover: accent left-rule.

### 4.4 Universidad (`/universidad/[id]`)

Profile page for a single institution.
- Breadcrumb (mono-meta) → state.
- Type chip + university name (display-2) + external website link styled as a hairline-underline.
- Stats row: `{n} carreras · {n} grados · estado: {name}` in mono.
- Carreras grouped by `grado` (Licenciatura, Maestría, Doctorado, …). Each group renders as a hairline-bordered region with the grade label in mono-meta top-left, and the carreras inside as a wrap of subtle hairline chips. Clicking a carrera goes to `/carrera/[slug]` (new — see §4.5) when that carrera has a slug.

### 4.5 Carrera (`/carrera/[slug]`) — **NEW**

For each unique carrera name (after normalization → kebab-case slug), pre-render a page that shows:
- Carrera name (display-2), subtitle `{n} universidades ofrecen esta carrera en México` in mono.
- A small instance of the Mexico map highlighting the states where this carrera is offered, with state fill proportional to the count of universities offering it. Same choropleth primitives as the index map.
- A list grouped by state of the universities offering it, each grouped block separated by hairlines.

This page is the strongest "data product" surface and showcases that the dataset is normalized enough to expose carrera-first navigation, not just institution-first.

### 4.6 AppShell (Navbar + global command palette)

- Navbar collapses to a thin (48px) fixed top bar: left = wordmark `universidades.mx` in mono-bold + a 1×1 hairline separator + breadcrumb of current page; right = ⌘K hint chip and the existing nav links rendered as mono-meta uppercase text. No glass blur. Bottom border is a single hairline.
- The chip is a `<button>` that opens the command palette. ⌘K / Ctrl+K keybinding active globally.
- Command palette (modal) is the **primary** search affordance:
  - Full-width modal (max 720px), single layer shadow, hairline border.
  - Search input identical to buscador, mono kbd hints.
  - Results grouped: Universidades / Carreras / Estados. Arrow-key navigation, Enter to navigate, Esc to close.
  - Shows top 5 of each group; "see all 23 carreras matching →" footer link goes to `/buscador?q=...`.
  - Recently visited (last 5, persisted to `localStorage`) when input is empty.

### 4.7 Footer

Trim to a single 64px-tall bar: left = `Datos SEP · sitio estático · MIT`, right = GitHub link. Anything more is noise on a page that is otherwise quiet.

## 5. Component architecture

New / changed components:

```
components/
  AppShell.vue              ← wraps NuxtPage, hosts CommandPalette + Navbar
  AppNavbar.vue             ← rewritten (thin, mono, hairline)
  AppFooter.vue             ← trimmed
  CommandPalette.vue        ← new; uses useSearchIndex
  MexicoMap.vue             ← rewritten with density modes + side panel
  MapStatePanel.vue         ← new; the sliding state-detail panel
  MapDensityToggle.vue      ← new; the density dropdown
  StateLeaderboard.vue      ← new; the Top-10 list on the index
  Chip.vue                  ← shared hairline chip (replaces inline class soup)
  Kbd.vue                   ← shared keyboard hint chip
  DataRow.vue               ← shared hairline row (replaces card-hover for list items)

composables/
  useUniversidadesData.ts   ← unchanged (signature stable)
  useSearchIndex.ts         ← new; builds Fuse indices once, shared by buscador + palette
  useDensity.ts             ← new; reactive state for the active density mode + computed per-estado values
  useCarreraSlugs.ts        ← new; SSG-time build of slug→carrera index
  mexicoSvg.ts              ← unchanged

pages/
  index.vue                 ← rewritten as the console
  buscador.vue              ← rewritten as hairline search
  estado/[id].vue           ← rewritten with micro-map + hairline rows
  universidad/[id].vue      ← rewritten
  carrera/[slug].vue        ← NEW
```

Each component has one job. The map component does not own search; the palette does not own routing; the leaderboard reads from `useDensity` and does not duplicate computation.

## 6. Data flow

- Same `useUniversidadesData()` fetches `/data/universidades.json` once and caches via the existing `useLazyFetch` key.
- `useSearchIndex()` lazily builds Fuse indices over `{ universidades, carreras, estados }` and exposes a single `search(query)` function returning grouped results. Both the buscador page and the command palette consume this — one Fuse build, two consumers.
- `useDensity()` exposes `{ mode, setMode, valueFor(estadoId), maxValue, scale }`. The map, the leaderboard, the legend, and the carrera page all read from it.
- `useCarreraSlugs()` runs at build time (via `nuxt.config.ts` prerender hook) to:
  - Normalize each carrera name → slug (lowercase, NFKD strip diacritics, kebab-case, dedupe).
  - Emit a `/carrera/[slug]` route per unique slug.
  - Persist a slug→carrera map alongside `universidades.json` (`/data/carrera-index.json`).

## 7. Static generation impact

- Current prerender count: `1 (/) + 1 (/buscador) + ~33 estados + ~3,467 universidades ≈ 3,502 routes`, ~6s build.
- New: add `/carrera/[slug]` — after dedupe, unique carrera names are estimated at ~6,000 (carrera names repeat heavily across universities; need to verify during implementation but order of magnitude is right). Worst case the prerender goes from ~3,500 → ~9,500 routes, build time from ~6s to ~15–20s. Still acceptable on Cloudflare Pages free tier.
- All new routes remain pure static HTML referencing the same single JSON blob — no per-route data fetching, no API surface added.

## 8. Error and empty states

- Loading: replace centered spinners with a top-of-page hairline progress bar (already present via `NuxtLoadingIndicator`) and skeleton placeholders for map paths (`--data-0` fill, no animation). No spinners anywhere in the new design.
- Search empty: `No hay resultados para "{query}".` in `--ink-3`, mono-italic. No icon.
- Data fetch failure: a single hairline-bordered region with `No pudimos cargar el catálogo. Recarga la página.` and an inline retry text-button. No red icon, no toast.
- 404 (state/university/carrera not found): existing `createError({ statusCode: 404 })` path stands; `error.vue` is restyled in the new system but is a small surface, fine to do last.

## 9. Accessibility

- All new interactive elements have visible focus states (2px accent ring, 2px offset).
- Command palette traps focus, Esc closes, returns focus to invoking element.
- Map state paths are made keyboard-navigable: each path receives `tabindex="0"`, `role="button"`, `aria-label="{state} — {count} universidades"`, and Enter activates navigation. (The current map is mouse-only.)
- Mono numerals use `tabular-nums` so screen-magnifier users see aligned columns.
- Color contrast: all type passes WCAG AA on `--paper`; the accent text on `--accent-soft` passes AA. Choropleth steps are verified for adjacent-step distinguishability (≥1.5 ΔL*).

## 10. Testing

- Vitest is already configured. Add component tests for: `CommandPalette` (keyboard nav, result grouping, empty/loading states), `MexicoMap` (density mode switching, side-panel behavior), `useSearchIndex` (Fuse construction is idempotent, returns grouped results), `useCarreraSlugs` (slug collisions resolved, NFKD diacritic stripping).
- Add a smoke test that the build outputs the expected number of `/carrera/*` routes (sanity check against the live data).
- No visual-regression tooling is added — keeping the dependency surface small. Snapshot testing is limited to the design tokens (`tokens.css` content stable) and component DOM shape, not visual pixels.

## 11. Phasing (intended for swarm parallelization)

The implementation plan that follows this spec will decompose into ~5 streams that can run in parallel after a brief sequential foundation phase:

- **Stream F (Foundation, sequential first):** design tokens (CSS variables, fonts, type scale), shared primitives (`Chip`, `Kbd`, `DataRow`), `useSearchIndex`, `useDensity`, `useCarreraSlugs` (build-time). Once this lands, the rest unblocks.
- **Stream A (parallel):** `MexicoMap` rewrite + `MapStatePanel` + `MapDensityToggle`.
- **Stream B (parallel):** `index.vue` console layout + `StateLeaderboard`.
- **Stream C (parallel):** `buscador.vue` rewrite + `CommandPalette` + `AppShell` integration.
- **Stream D (parallel):** `estado/[id].vue` + `universidad/[id].vue` + `AppNavbar` + `AppFooter` restyling.
- **Stream E (parallel):** `carrera/[slug].vue` + carrera-index data emission + prerender wiring.

This parallelization is what writing-plans will formalize into the implementation plan. The spec only asserts the work decomposes cleanly along these seams.

## 12. Open questions and explicit decisions

- **JT Mono is paid.** If the user does not have a license, the fallback is `JetBrains Mono` (open-source, available on Google Fonts). The implementation will use JetBrains Mono as the shipped default. JT Mono is referenced only as the design aspiration.
- **Source Serif 4:** used in exactly one location on the index page (§3.3). Available on Google Fonts. Adds ~20 KB to the font payload. Decision: include it; the typographic contrast is worth the byte cost on a page that is otherwise small.
- **Density "% public":** requires that `universidad.tipo` cleanly separates public vs private. If the data turns out to be messier (e.g., many `tipo` values), this density mode will be replaced with "% with website" or dropped silently. Verified during implementation; not a blocker.
- **The legacy `og-image.png`** will be regenerated to reflect the new identity. Out of scope for the swarm; a follow-up.

## 13. Why this is the right design for the resume

- **Differentiation:** the warm-paper light identity with an editorial kicker and monospace data is rare in SaaS portfolios — the project will not look like a Tailwind template.
- **Technical signal:** the carrera-slug pre-render, the density choropleth, and the shared search index are non-trivial engineering moves that a reader of the GitHub repo can see and respect.
- **UX signal:** ⌘K + keyboard-navigable map + side panel + restrained motion show product taste at the level Linear/Stripe/Notion candidates demonstrate.
- **Coherence with the resume:** an Applied AI engineer who has shipped MCP servers, on-prem inference, and DCF/IRR/Monte Carlo models should have a portfolio page that looks like an instrument, not a marketing template. This redesign delivers that.
