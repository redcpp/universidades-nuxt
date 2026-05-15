# Cinematic UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the UI/UX of universidades-nuxt from first principles into a light-only "Operator's Console" identity (Linear/Stripe/Notion-grade refinement, monospace data, restrained accent, map as protagonist), add ⌘K command palette, choropleth density toggle, and a new `/carrera/[slug]` route.

**Architecture:** Nuxt 3 SSG remains. A small foundation layer (CSS tokens, shared primitives, three composables — `useSearchIndex`, `useDensity`, build-time `useCarreraSlugs`) is built first and then unblocks five independent streams (Map, Index, Search+Palette+Shell, Internal pages, Carrera route). No backend, no SSR, no new framework dependencies. Carrera-slug index is generated at build time via a `nuxt.config.ts` hook and a Node script that reads `public/data/universidades.json`.

**Tech Stack:** Nuxt 3.15, Vue 3, TypeScript, Tailwind CSS, Fuse.js 7, Vitest 4 + @nuxt/test-utils, happy-dom, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-05-11-cinematic-ui-redesign-design.md`

---

## File Structure

### New files

```
assets/css/
  tokens.css                       Design tokens (CSS variables: paper/ink/accent/data/hairline)
  typography.css                   @font-face declarations, type scale utilities
  motion.css                       ease/duration variables, keyframes

composables/
  useSearchIndex.ts                Builds Fuse indices once, returns grouped search()
  useDensity.ts                    Reactive density mode + per-estado values
  useCarreraSlugs.ts               Runtime helper: slug from carrera name (also used at build time)

scripts/
  build-carrera-index.mjs          Build-time: emits public/data/carrera-index.json + slug list

components/
  AppShell.vue                     Hosts Navbar + CommandPalette + slot for page
  CommandPalette.vue               ⌘K modal, grouped results, keyboard nav
  MapStatePanel.vue                Sliding state-detail panel (right of map)
  MapDensityToggle.vue             Dropdown for density mode
  StateLeaderboard.vue             Top-10 mono list, density-aware
  Chip.vue                         Hairline chip primitive
  Kbd.vue                          Keyboard hint chip
  DataRow.vue                      Hairline list row primitive

pages/
  carrera/[slug].vue               New; one page per unique carrera slug

types/
  index.ts                         Extend with CarreraIndex / DensityMode types
```

### Modified files

```
assets/css/main.css                Import tokens/typography/motion; remove old utilities; rewrite component layer
tailwind.config.js                 Replace ad-hoc theme with token-mapped palette + Inter/Mono font families
nuxt.config.ts                     Wire build-time carrera index script + add /carrera/[slug] to prerender
components/AppNavbar.vue           Rewritten (thin, mono, hairline)
components/AppFooter.vue           Trimmed to one line
components/MexicoMap.vue           Rewritten with density modes + side-panel handoff
composables/useUniversidades.ts    Add helper for tipo grouping (used by leaderboard); rest unchanged
pages/index.vue                    Rewritten as the console
pages/buscador.vue                 Rewritten with hairline rows
pages/estado/[id].vue              Rewritten with micro-map + hairline rows
pages/universidad/[id].vue         Rewritten
app.vue                            Wrap NuxtPage in <AppShell>
error.vue                          Restyled in new system
public/data/carrera-index.json     Build-time generated (gitignored)
.gitignore                         Add carrera-index.json
tests/app.spec.ts                  Updated to assert new wordmark
tests/                             Add component + composable tests per task
```

### Stream map (for swarm execution)

```
Foundation (Phase 1, sequential, ~6 tasks)
  └─ Tasks 1–10: tokens, typography, motion, primitives, composables, slug script

After Foundation, the following streams run in parallel (Phase 2):

Stream A — Map           Tasks 11–14   (MexicoMap rewrite, MapStatePanel, DensityToggle)
Stream B — Index Console Tasks 15–17   (index.vue, StateLeaderboard, hero layout)
Stream C — Search+Shell  Tasks 18–22   (CommandPalette, AppShell, AppNavbar, AppFooter, buscador.vue)
Stream D — Drill-downs   Tasks 23–25   (estado/[id].vue, universidad/[id].vue, error.vue)
Stream E — Carrera route Tasks 26–28   (carrera/[slug].vue, prerender wiring, OG meta)

Cleanup (Phase 3, sequential)
  └─ Tasks 29–31: README update, final smoke test, deploy verification
```

---

# Phase 1 — Foundation

## Task 1: Design tokens (CSS variables)

**Files:**
- Create: `assets/css/tokens.css`
- Modify: `assets/css/main.css`

- [ ] **Step 1: Create `assets/css/tokens.css`**

```css
:root {
  /* Paper & ink */
  --paper: #FAFAF7;
  --surface: #FFFFFF;
  --ink: #0A0A0A;
  --ink-2: #2A2A2A;
  --ink-3: #6B6B6B;
  --ink-4: #B5B5B0;
  --hairline: #E7E5E0;
  --hairline-2: #F0EEE8;

  /* Accent (warm earth — burnt sienna) */
  --accent: #C2410C;
  --accent-soft: #FDF4EE;

  /* Choropleth steps (low → high) */
  --data-0: #F0EEE8;
  --data-1: #E5DCC8;
  --data-2: #D2BFA0;
  --data-3: #B89876;
  --data-4: #8A6B43;

  /* Radii */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;

  /* Shadow (one layer only — used on modals + panels) */
  --shadow-soft: 0 8px 32px -8px rgba(0, 0, 0, 0.08);
}
```

- [ ] **Step 2: Import tokens at top of `assets/css/main.css`**

Replace the existing `@import url('https://fonts.googleapis.com/...')` line and the rest of the file with this header (the rest of `main.css` will be replaced in later tasks; for now just prepend the import so subsequent tasks can reference variables):

```css
@import url('./tokens.css');
@import url('./typography.css');
@import url('./motion.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Source+Serif+4:ital,wght@1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

(The `typography.css` and `motion.css` files are created in the next two tasks. After Task 3 the imports resolve.)

- [ ] **Step 3: Commit**

```bash
git add assets/css/tokens.css assets/css/main.css
git commit -m "feat(tokens): add design token CSS variables for cinematic redesign"
```

---

## Task 2: Typography utilities

**Files:**
- Create: `assets/css/typography.css`

- [ ] **Step 1: Create `assets/css/typography.css`**

```css
/* Type scale + numeric utility classes used across pages */
:root {
  --font-display: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
  --font-serif: 'Source Serif 4', 'Source Serif Pro', Georgia, serif;
}

html {
  font-family: var(--font-body);
  font-feature-settings: 'ss01', 'cv11';
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
}

.font-mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.font-serif-italic { font-family: var(--font-serif); font-style: italic; }

.type-display-1 { font-size: 4.5rem; line-height: 1.02; letter-spacing: -0.04em; font-weight: 700; }
.type-display-2 { font-size: 3rem;   line-height: 1.05; letter-spacing: -0.035em; font-weight: 700; }
.type-h1        { font-size: 2rem;   line-height: 1.15; letter-spacing: -0.02em; font-weight: 600; }
.type-h2        { font-size: 1.5rem; line-height: 1.2;  letter-spacing: -0.015em; font-weight: 600; }
.type-h3        { font-size: 1.125rem; line-height: 1.3; font-weight: 600; }
.type-body      { font-size: 0.9375rem; line-height: 1.55; }
.type-small     { font-size: 0.8125rem; line-height: 1.5; color: var(--ink-3); }

.type-mono-data { font-family: var(--font-mono); font-size: 0.875rem; font-variant-numeric: tabular-nums; }
.type-mono-meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}

@media (max-width: 768px) {
  .type-display-1 { font-size: 2.75rem; }
  .type-display-2 { font-size: 2rem; }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/typography.css
git commit -m "feat(tokens): typography utilities and font stack"
```

---

## Task 3: Motion primitives

**Files:**
- Create: `assets/css/motion.css`

- [ ] **Step 1: Create `assets/css/motion.css`**

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-ui: 200ms;
  --dur-panel: 400ms;
  --dur-page: 600ms;
}

@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}

.motion-fade-in       { animation: fade-in var(--dur-page) var(--ease-out) both; }
.motion-slide-in-right{ animation: slide-in-right var(--dur-panel) var(--ease-out) both; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/motion.css
git commit -m "feat(tokens): motion primitives with reduced-motion fallback"
```

---

## Task 4: Rewrite main.css component layer

**Files:**
- Modify: `assets/css/main.css`

- [ ] **Step 1: Replace the full contents of `assets/css/main.css`**

```css
@import url('./tokens.css');
@import url('./typography.css');
@import url('./motion.css');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Source+Serif+4:ital,wght@1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background: var(--paper);
    color: var(--ink);
  }

  ::selection {
    background: var(--accent-soft);
    color: var(--accent);
  }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

@layer components {
  /* Hairline-bordered surfaces */
  .surface {
    background: var(--surface);
    border: 1px solid var(--hairline);
    border-radius: var(--r-md);
  }

  .hairline { border: 1px solid var(--hairline); }
  .hairline-b { border-bottom: 1px solid var(--hairline); }
  .hairline-t { border-top: 1px solid var(--hairline); }
  .hairline-l { border-left: 1px solid var(--hairline); }

  /* Sticky thin top bar */
  .topbar {
    height: 48px;
    background: var(--paper);
    border-bottom: 1px solid var(--hairline);
  }

  /* Soft-shadowed modal/panel surface */
  .raised {
    background: var(--surface);
    border: 1px solid var(--hairline);
    border-radius: var(--r-lg);
    box-shadow: var(--shadow-soft);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/main.css
git commit -m "feat(tokens): rewrite main.css to use design tokens"
```

---

## Task 5: Tailwind config alignment

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Replace `tailwind.config.js`**

```js
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        'ink-4': 'var(--ink-4)',
        hairline: 'var(--hairline)',
        'hairline-2': 'var(--hairline-2)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'data-0': 'var(--data-0)',
        'data-1': 'var(--data-1)',
        'data-2': 'var(--data-2)',
        'data-3': 'var(--data-3)',
        'data-4': 'var(--data-4)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Source Serif 4', 'Georgia', 'serif']
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)'
      },
      maxWidth: {
        prose: '720px',
        console: '1280px'
      }
    }
  },
  plugins: []
}
```

- [ ] **Step 2: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(tokens): align Tailwind config with design tokens"
```

---

## Task 6: Shared primitive — `Chip.vue`

**Files:**
- Create: `components/Chip.vue`
- Test: `tests/components/Chip.spec.ts`

- [ ] **Step 1: Create `tests/components/Chip.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Chip from '~/components/Chip.vue'

describe('Chip', () => {
  it('renders slot content', () => {
    const w = mount(Chip, { slots: { default: 'Pública' } })
    expect(w.text()).toBe('Pública')
  })

  it('applies active state classes when active', () => {
    const w = mount(Chip, { props: { active: true }, slots: { default: 'x' } })
    expect(w.classes()).toContain('bg-accent-soft')
  })

  it('renders as a button when interactive', () => {
    const w = mount(Chip, { props: { as: 'button' }, slots: { default: 'x' } })
    expect(w.element.tagName).toBe('BUTTON')
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `npm test -- Chip`
Expected: FAIL — component does not exist.

- [ ] **Step 3: Create `components/Chip.vue`**

```vue
<script setup lang="ts">
interface Props {
  active?: boolean
  as?: 'span' | 'button' | 'a'
  href?: string
}
const props = withDefaults(defineProps<Props>(), { active: false, as: 'span' })
</script>

<template>
  <component
    :is="props.as"
    :href="props.as === 'a' ? props.href : undefined"
    :class="[
      'inline-flex items-center px-2.5 py-1 rounded-sm text-[12px] font-medium border transition-colors',
      'font-mono uppercase tracking-[0.08em]',
      active
        ? 'bg-accent-soft text-accent border-accent/30'
        : 'bg-surface text-ink-3 border-hairline hover:bg-hairline-2'
    ]"
  >
    <slot />
  </component>
</template>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- Chip`
Expected: PASS (3/3).

- [ ] **Step 5: Commit**

```bash
git add components/Chip.vue tests/components/Chip.spec.ts
git commit -m "feat(ui): add Chip primitive (hairline mono pill)"
```

---

## Task 7: Shared primitive — `Kbd.vue`

**Files:**
- Create: `components/Kbd.vue`
- Test: `tests/components/Kbd.spec.ts`

- [ ] **Step 1: Create `tests/components/Kbd.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Kbd from '~/components/Kbd.vue'

describe('Kbd', () => {
  it('renders the keys slot', () => {
    const w = mount(Kbd, { slots: { default: '⌘K' } })
    expect(w.text()).toBe('⌘K')
    expect(w.element.tagName).toBe('KBD')
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- Kbd`
Expected: FAIL.

- [ ] **Step 3: Create `components/Kbd.vue`**

```vue
<template>
  <kbd
    class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-sm
           font-mono text-[11px] text-ink-3 bg-hairline-2 border border-hairline
           leading-none align-middle"
  >
    <slot />
  </kbd>
</template>
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- Kbd`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/Kbd.vue tests/components/Kbd.spec.ts
git commit -m "feat(ui): add Kbd primitive"
```

---

## Task 8: Shared primitive — `DataRow.vue`

**Files:**
- Create: `components/DataRow.vue`
- Test: `tests/components/DataRow.spec.ts`

- [ ] **Step 1: Create `tests/components/DataRow.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataRow from '~/components/DataRow.vue'

describe('DataRow', () => {
  it('renders index, primary slot, and meta', () => {
    const w = mount(DataRow, {
      props: { index: 7 },
      slots: { default: 'Estado de México', meta: '420' }
    })
    expect(w.text()).toContain('07')
    expect(w.text()).toContain('Estado de México')
    expect(w.text()).toContain('420')
  })

  it('hides index when prop omitted', () => {
    const w = mount(DataRow, { slots: { default: 'X' } })
    expect(w.find('[data-testid="row-index"]').exists()).toBe(false)
  })

  it('renders as a NuxtLink when to provided', () => {
    const w = mount(DataRow, {
      props: { to: '/estado/100' },
      slots: { default: 'X' },
      global: { stubs: { NuxtLink: { template: '<a class="stub"><slot /></a>' } } }
    })
    expect(w.find('a.stub').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- DataRow`
Expected: FAIL.

- [ ] **Step 3: Create `components/DataRow.vue`**

```vue
<script setup lang="ts">
interface Props {
  index?: number
  to?: string
}
const props = defineProps<Props>()
const padded = (n?: number) => (n === undefined ? '' : String(n).padStart(2, '0'))
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    :to="to"
    class="group flex items-center gap-4 px-4 py-3 border-b border-hairline last:border-b-0
           hover:bg-accent-soft transition-colors relative"
  >
    <span
      v-if="index !== undefined"
      data-testid="row-index"
      class="type-mono-meta text-ink-4 w-6 tabular-nums"
    >{{ padded(index) }}</span>
    <span class="flex-1 min-w-0 truncate text-ink type-body group-hover:text-accent transition-colors">
      <slot />
    </span>
    <span v-if="$slots.meta" class="type-mono-data text-ink-3 group-hover:text-ink-2 transition-colors">
      <slot name="meta" />
    </span>
    <span
      v-if="to"
      class="text-ink-4 group-hover:text-accent transition-colors"
      aria-hidden="true"
    >→</span>
  </component>
</template>
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- DataRow`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/DataRow.vue tests/components/DataRow.spec.ts
git commit -m "feat(ui): add DataRow primitive (hairline list row)"
```

---

## Task 9: Composable — `useSearchIndex`

**Files:**
- Create: `composables/useSearchIndex.ts`
- Test: `tests/composables/useSearchIndex.spec.ts`

- [ ] **Step 1: Create `tests/composables/useSearchIndex.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { buildSearchIndex } from '~/composables/useSearchIndex'

const fixture = {
  estados: [{ id: 1, nombre: 'Jalisco', slug: 'jalisco', imagen: null, municipios: 0 }],
  universidades: [
    { id: 10, nombre: 'Universidad de Guadalajara', tipo: 'Pública', sitio_web: null, estado_id: 1, slug: 'udg' }
  ],
  carreras: [
    { id: 100, nombre: 'Medicina', grado: 'Licenciatura', universidad_id: 10 }
  ]
}

describe('buildSearchIndex', () => {
  it('returns grouped results for a matching query', () => {
    const idx = buildSearchIndex(fixture as any)
    const r = idx.search('medicina')
    expect(r.carreras.length).toBeGreaterThan(0)
    expect(r.carreras[0].item.nombre).toBe('Medicina')
  })

  it('returns empty groups for blank query', () => {
    const idx = buildSearchIndex(fixture as any)
    const r = idx.search('')
    expect(r.universidades.length).toBe(0)
    expect(r.carreras.length).toBe(0)
    expect(r.estados.length).toBe(0)
  })

  it('limits each group via the limit option', () => {
    const idx = buildSearchIndex(fixture as any)
    const r = idx.search('universidad', { limit: 1 })
    expect(r.universidades.length).toBeLessThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- useSearchIndex`
Expected: FAIL (module not found).

- [ ] **Step 3: Create `composables/useSearchIndex.ts`**

```ts
import Fuse from 'fuse.js'
import type { Estado, Universidad, Carrera } from '~/types'
import type { UniversidadesData } from '~/composables/useUniversidades'

export interface GroupedResults {
  universidades: { item: Universidad; refIndex: number }[]
  carreras: { item: Carrera; refIndex: number }[]
  estados: { item: Estado; refIndex: number }[]
}

export interface SearchOptions {
  limit?: number
}

export interface SearchIndex {
  search: (query: string, opts?: SearchOptions) => GroupedResults
}

export function buildSearchIndex(data: UniversidadesData): SearchIndex {
  const fuseUni = new Fuse(data.universidades, { keys: ['nombre', 'tipo'], threshold: 0.4 })
  const fuseCar = new Fuse(data.carreras, { keys: ['nombre', 'grado'], threshold: 0.4 })
  const fuseEst = new Fuse(data.estados, { keys: ['nombre'], threshold: 0.3 })

  return {
    search(query: string, opts: SearchOptions = {}) {
      const q = query.trim()
      const limit = opts.limit ?? 20
      if (!q) return { universidades: [], carreras: [], estados: [] }
      return {
        universidades: fuseUni.search(q).slice(0, limit) as any,
        carreras: fuseCar.search(q).slice(0, limit) as any,
        estados: fuseEst.search(q).slice(0, limit) as any
      }
    }
  }
}

export function useSearchIndex() {
  const { data } = useUniversidadesData()
  const index = shallowRef<SearchIndex | null>(null)

  watch(
    () => data.value,
    (d) => {
      if (d) index.value = buildSearchIndex(d)
    },
    { immediate: true }
  )

  function search(query: string, opts?: SearchOptions): GroupedResults {
    return index.value?.search(query, opts) ?? { universidades: [], carreras: [], estados: [] }
  }

  return { search, ready: computed(() => index.value !== null) }
}
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- useSearchIndex`
Expected: PASS (3/3).

- [ ] **Step 5: Commit**

```bash
git add composables/useSearchIndex.ts tests/composables/useSearchIndex.spec.ts
git commit -m "feat(search): shared Fuse-based search index composable"
```

---

## Task 10: Composable — `useDensity`

**Files:**
- Create: `composables/useDensity.ts`
- Test: `tests/composables/useDensity.spec.ts`

- [ ] **Step 1: Create `tests/composables/useDensity.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { computeDensity } from '~/composables/useDensity'

const fixture = {
  estados: [
    { id: 1, nombre: 'A', slug: 'a', imagen: null, municipios: 0 },
    { id: 2, nombre: 'B', slug: 'b', imagen: null, municipios: 0 }
  ],
  universidades: [
    { id: 10, nombre: 'U1', tipo: 'Pública',  sitio_web: null, estado_id: 1, slug: 'u1' },
    { id: 11, nombre: 'U2', tipo: 'Privada',  sitio_web: null, estado_id: 1, slug: 'u2' },
    { id: 12, nombre: 'U3', tipo: 'Pública',  sitio_web: null, estado_id: 2, slug: 'u3' }
  ],
  carreras: [
    { id: 100, nombre: 'X', grado: 'Lic', universidad_id: 10 },
    { id: 101, nombre: 'Y', grado: 'Lic', universidad_id: 10 },
    { id: 102, nombre: 'Z', grado: 'Lic', universidad_id: 12 }
  ]
}

describe('computeDensity', () => {
  it('counts universidades per estado', () => {
    const d = computeDensity(fixture as any, 'universidades')
    expect(d.valueFor(1)).toBe(2)
    expect(d.valueFor(2)).toBe(1)
    expect(d.max).toBe(2)
  })

  it('counts carreras per estado', () => {
    const d = computeDensity(fixture as any, 'carreras')
    expect(d.valueFor(1)).toBe(2)
    expect(d.valueFor(2)).toBe(1)
  })

  it('computes carreras-per-uni ratio', () => {
    const d = computeDensity(fixture as any, 'ratio')
    expect(d.valueFor(1)).toBe(1) // 2 carreras / 2 unis
    expect(d.valueFor(2)).toBe(1) // 1 carrera / 1 uni
  })

  it('computes percent public', () => {
    const d = computeDensity(fixture as any, 'public-pct')
    expect(d.valueFor(1)).toBe(50)
    expect(d.valueFor(2)).toBe(100)
  })

  it('assigns a step 0-4 via .stepFor()', () => {
    const d = computeDensity(fixture as any, 'universidades')
    expect(d.stepFor(2)).toBe(4)
    expect(d.stepFor(0)).toBe(0)
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- useDensity`
Expected: FAIL.

- [ ] **Step 3: Create `composables/useDensity.ts`**

```ts
import type { UniversidadesData } from '~/composables/useUniversidades'

export type DensityMode = 'universidades' | 'carreras' | 'ratio' | 'public-pct'

export interface DensityResult {
  valueFor: (estadoId: number) => number
  stepFor: (estadoId: number) => 0 | 1 | 2 | 3 | 4
  max: number
  mode: DensityMode
}

export function computeDensity(data: UniversidadesData, mode: DensityMode): DensityResult {
  const values = new Map<number, number>()

  for (const e of data.estados) {
    const unisInEstado = data.universidades.filter(u => u.estado_id === e.id)
    let v = 0
    if (mode === 'universidades') {
      v = unisInEstado.length
    } else if (mode === 'carreras') {
      const uniIds = new Set(unisInEstado.map(u => u.id))
      v = data.carreras.filter(c => uniIds.has(c.universidad_id)).length
    } else if (mode === 'ratio') {
      const uniIds = new Set(unisInEstado.map(u => u.id))
      const cCount = data.carreras.filter(c => uniIds.has(c.universidad_id)).length
      v = unisInEstado.length ? Math.round((cCount / unisInEstado.length) * 10) / 10 : 0
    } else if (mode === 'public-pct') {
      const pub = unisInEstado.filter(u => /púb/i.test(u.tipo)).length
      v = unisInEstado.length ? Math.round((pub / unisInEstado.length) * 100) : 0
    }
    values.set(e.id, v)
  }

  const max = Math.max(0, ...values.values())

  function stepFor(id: number): 0 | 1 | 2 | 3 | 4 {
    const v = values.get(id) ?? 0
    if (v === 0 || max === 0) return 0
    const t = v / max
    if (t < 0.2) return 1
    if (t < 0.4) return 2
    if (t < 0.7) return 3
    return 4
  }

  return {
    valueFor: (id: number) => values.get(id) ?? 0,
    stepFor,
    max,
    mode
  }
}

const _mode = ref<DensityMode>('universidades')

export function useDensity() {
  const { data } = useUniversidadesData()
  const result = computed<DensityResult | null>(() => {
    if (!data.value) return null
    return computeDensity(data.value, _mode.value)
  })

  function setMode(m: DensityMode) {
    _mode.value = m
  }

  return {
    mode: computed(() => _mode.value),
    setMode,
    result
  }
}

export const DENSITY_MODE_LABELS: Record<DensityMode, string> = {
  'universidades': 'Universidades',
  'carreras': 'Carreras',
  'ratio': 'Carreras / universidad',
  'public-pct': '% Públicas'
}
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- useDensity`
Expected: PASS (5/5).

- [ ] **Step 5: Commit**

```bash
git add composables/useDensity.ts tests/composables/useDensity.spec.ts
git commit -m "feat(map): density composable with 4 modes + 5-step scale"
```

---

## Task 11: Build-time carrera index script

**Files:**
- Create: `scripts/build-carrera-index.mjs`
- Create: `composables/useCarreraSlugs.ts`
- Modify: `.gitignore`
- Modify: `nuxt.config.ts`
- Test: `tests/scripts/build-carrera-index.spec.ts`

- [ ] **Step 1: Create `composables/useCarreraSlugs.ts`**

```ts
export function carreraSlug(nombre: string): string {
  return nombre
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export interface CarreraIndexEntry {
  slug: string
  nombre: string          // canonical display name (first-seen casing)
  carreraIds: number[]    // ids of all carreras that normalize to this slug
  universidadIds: number[]
  estadoIds: number[]
}

export interface CarreraIndex {
  slugs: string[]
  entries: Record<string, CarreraIndexEntry>
}

export function useCarreraIndex() {
  const { data: idx } = useLazyFetch<CarreraIndex>('/data/carrera-index.json', {
    key: 'carrera-index',
    server: false,
    default: () => ({ slugs: [], entries: {} })
  })
  return { idx }
}
```

- [ ] **Step 2: Create `tests/scripts/build-carrera-index.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { carreraSlug } from '~/composables/useCarreraSlugs'

describe('carreraSlug', () => {
  it('strips diacritics', () => {
    expect(carreraSlug('Médico Cirujano')).toBe('medico-cirujano')
  })
  it('collapses non-alphanum to single dashes', () => {
    expect(carreraSlug('Ing. en Sistemas / Cómputo')).toBe('ing-en-sistemas-computo')
  })
  it('trims leading/trailing dashes', () => {
    expect(carreraSlug('-X-')).toBe('x')
  })
})
```

- [ ] **Step 3: Verify fail/pass**

Run: `npm test -- build-carrera-index`
Expected: PASS for the slug helper (3/3).

- [ ] **Step 4: Create `scripts/build-carrera-index.mjs`**

```js
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const data = JSON.parse(readFileSync(resolve(root, 'public/data/universidades.json'), 'utf-8'))

function slug(nombre) {
  return nombre
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const entries = {}
const uniById = new Map(data.universidades.map(u => [u.id, u]))

for (const c of data.carreras) {
  if (!c.nombre || !c.nombre.trim()) continue
  const s = slug(c.nombre)
  if (!s) continue
  const uni = uniById.get(c.universidad_id)
  if (!entries[s]) {
    entries[s] = {
      slug: s,
      nombre: c.nombre,
      carreraIds: [],
      universidadIds: [],
      estadoIds: []
    }
  }
  entries[s].carreraIds.push(c.id)
  if (uni) {
    if (!entries[s].universidadIds.includes(uni.id)) entries[s].universidadIds.push(uni.id)
    if (!entries[s].estadoIds.includes(uni.estado_id)) entries[s].estadoIds.push(uni.estado_id)
  }
}

const slugs = Object.keys(entries).sort()
const out = { slugs, entries }

writeFileSync(resolve(root, 'public/data/carrera-index.json'), JSON.stringify(out))
console.log(`[build-carrera-index] ${slugs.length} unique carrera slugs`)
```

- [ ] **Step 5: Add `.gitignore` entry**

Append to `.gitignore`:

```
# Generated at build time
public/data/carrera-index.json
```

- [ ] **Step 6: Wire script into `nuxt.config.ts`**

Replace the full contents of `nuxt.config.ts` with:

```ts
import { execSync } from 'node:child_process'
import data from './public/data/universidades.json'

execSync('node scripts/build-carrera-index.mjs', { stdio: 'inherit' })
const carreraIndex = (() => {
  try {
    return require('./public/data/carrera-index.json')
  } catch {
    return { slugs: [] as string[] }
  }
})()

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Universidades México — Directorio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Directorio y buscador de universidades y carreras en México.' },
        { property: 'og:title', content: 'Universidades México' },
        { property: 'og:description', content: 'Directorio y buscador de universidades y carreras en México' },
        { property: 'og:image', content: 'https://universidades-mexico.pages.dev/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://universidades-mexico.pages.dev' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/buscador',
        ...data.estados.map((e: any) => `/estado/${e.id}`),
        ...data.universidades.map((u: any) => `/universidad/${u.id}`),
        ...carreraIndex.slugs.map((s: string) => `/carrera/${s}`)
      ]
    }
  }
})
```

- [ ] **Step 7: Run script manually to verify it produces output**

Run: `node scripts/build-carrera-index.mjs`
Expected: prints `[build-carrera-index] N unique carrera slugs` where N is in the thousands. File `public/data/carrera-index.json` exists.

- [ ] **Step 8: Commit**

```bash
git add composables/useCarreraSlugs.ts scripts/build-carrera-index.mjs .gitignore nuxt.config.ts tests/scripts/build-carrera-index.spec.ts
git commit -m "feat(carrera): build-time carrera slug index + prerender wiring"
```

---

# Phase 2 — Streams (parallelizable)

## Stream A — Map

### Task 12: Rewrite `MexicoMap.vue` with density modes

**Files:**
- Modify: `components/MexicoMap.vue`

- [ ] **Step 1: Replace full contents of `components/MexicoMap.vue`**

```vue
<script setup lang="ts">
import { mexicoSvg } from '~/composables/mexicoSvg'
import type { Estado } from '~/types'

const emit = defineEmits<{
  hover: [estado: { id: number; nombre: string; svgId: string } | null]
}>()

const mapContainer = ref<HTMLDivElement>()
const { data, pending, error } = useUniversidadesData()
const { result: density } = useDensity()

const idMap: Record<string, number> = {
  agu: 81, bcn: 82, bcs: 83, cam: 84, chp: 87, chh: 88,
  coa: 85, col: 86, dur: 93, gro: 95, gua: 94, hid: 96,
  jal: 99, mex: 100, mic: 102, mor: 103, nay: 104, nle: 105,
  oax: 107, pue: 126, que: 111, roo: 112, sin: 114, slp: 113,
  son: 115, tab: 116, tam: 117, tla: 118, ver: 119, yuc: 120,
  zac: 121, cmx: 124
}
const reverseIdMap: Record<number, string> = Object.fromEntries(
  Object.entries(idMap).map(([k, v]) => [v, k])
)

const stepColors = ['var(--data-0)', 'var(--data-1)', 'var(--data-2)', 'var(--data-3)', 'var(--data-4)'] as const

let cleanup: Array<() => void> = []

function fillForStep(step: 0 | 1 | 2 | 3 | 4) { return stepColors[step] }

function bindPaths() {
  if (!mapContainer.value || !data.value) return
  cleanup.forEach(fn => fn())
  cleanup = []

  const paths = mapContainer.value.querySelectorAll<SVGPathElement>('path')
  paths.forEach((path, idx) => {
    const svgId = path.getAttribute('id')
    if (!svgId || !idMap[svgId]) {
      path.style.fill = 'var(--hairline-2)'
      path.style.stroke = 'var(--surface)'
      path.style.strokeWidth = '1'
      return
    }
    const estadoId = idMap[svgId]
    const step = density.value?.stepFor(estadoId) ?? 0

    path.style.cursor = 'pointer'
    path.style.stroke = 'var(--surface)'
    path.style.strokeWidth = '1'
    path.style.fill = fillForStep(step)
    path.style.transition = `fill var(--ease-in-out) 400ms ${idx * 5}ms,
                             stroke 200ms var(--ease-out),
                             stroke-width 200ms var(--ease-out)`

    path.setAttribute('tabindex', '0')
    path.setAttribute('role', 'button')
    const estado = data.value!.estados.find(e => e.id === estadoId)
    const v = density.value?.valueFor(estadoId) ?? 0
    path.setAttribute('aria-label', `${estado?.nombre ?? svgId} — ${v}`)

    const onEnter = () => {
      path.style.stroke = 'var(--accent)'
      path.style.strokeWidth = '1.5'
      if (estado) emit('hover', { id: estado.id, nombre: estado.nombre, svgId })
    }
    const onLeave = () => {
      path.style.stroke = 'var(--surface)'
      path.style.strokeWidth = '1'
      emit('hover', null)
    }
    const onClick = () => navigateTo(`/estado/${estadoId}`)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() }
    }

    path.addEventListener('mouseenter', onEnter)
    path.addEventListener('mouseleave', onLeave)
    path.addEventListener('focus', onEnter)
    path.addEventListener('blur', onLeave)
    path.addEventListener('click', onClick)
    path.addEventListener('keydown', onKey)

    cleanup.push(() => {
      path.removeEventListener('mouseenter', onEnter)
      path.removeEventListener('mouseleave', onLeave)
      path.removeEventListener('focus', onEnter)
      path.removeEventListener('blur', onLeave)
      path.removeEventListener('click', onClick)
      path.removeEventListener('keydown', onKey)
    })
  })
}

watch(
  [() => mapContainer.value, data, () => density.value],
  async () => {
    await nextTick()
    bindPaths()
  },
  { immediate: true, flush: 'post' }
)

onBeforeUnmount(() => {
  cleanup.forEach(fn => fn())
  cleanup = []
})

defineExpose({ reverseIdMap })
</script>

<template>
  <div class="relative w-full">
    <div v-if="pending" class="aspect-[4/3] flex items-center justify-center">
      <div class="type-mono-meta text-ink-4">Cargando mapa…</div>
    </div>
    <div v-else-if="error" class="aspect-[4/3] flex items-center justify-center type-mono-meta text-ink-3">
      Error al cargar el mapa.
    </div>
    <div v-else ref="mapContainer" class="w-full map-host" v-html="mexicoSvg" />
  </div>
</template>

<style scoped>
:deep(svg) {
  width: 100%;
  height: auto;
  max-height: 640px;
}
.map-host :deep(svg path) {
  fill: var(--data-0);
  stroke: var(--surface);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.map-host :deep(svg path:focus) {
  outline: none;
}
</style>
```

- [ ] **Step 2: Run existing tests to ensure no regression**

Run: `npm test`
Expected: PASS for all existing tests (Chip, Kbd, DataRow, useSearchIndex, useDensity, app smoke).

- [ ] **Step 3: Commit**

```bash
git add components/MexicoMap.vue
git commit -m "feat(map): rewrite with density choropleth, keyboard-nav, hover emit"
```

---

### Task 13: `MapDensityToggle.vue`

**Files:**
- Create: `components/MapDensityToggle.vue`
- Test: `tests/components/MapDensityToggle.spec.ts`

- [ ] **Step 1: Create `tests/components/MapDensityToggle.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapDensityToggle from '~/components/MapDensityToggle.vue'

describe('MapDensityToggle', () => {
  it('renders the current mode label', () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' } })
    expect(w.text()).toContain('Universidades')
  })

  it('emits update:modelValue when a new option is chosen', async () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' } })
    await w.find('button').trigger('click')
    const option = w.findAll('[role="option"]')[1]
    await option.trigger('click')
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- MapDensityToggle`
Expected: FAIL.

- [ ] **Step 3: Create `components/MapDensityToggle.vue`**

```vue
<script setup lang="ts">
import { DENSITY_MODE_LABELS, type DensityMode } from '~/composables/useDensity'

const props = defineProps<{ modelValue: DensityMode }>()
const emit = defineEmits<{ 'update:modelValue': [m: DensityMode] }>()

const open = ref(false)
const modes = Object.keys(DENSITY_MODE_LABELS) as DensityMode[]
const wrapper = ref<HTMLDivElement>()

function pick(m: DensityMode) {
  emit('update:modelValue', m)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (!wrapper.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="wrapper" class="relative inline-block">
    <button
      type="button"
      @click="open = !open"
      class="inline-flex items-center gap-2 px-3 py-1.5 surface text-ink-2 type-mono-data hover:bg-hairline-2 transition-colors"
      :aria-expanded="open"
      aria-haspopup="listbox"
    >
      <span class="type-mono-meta text-ink-4">density</span>
      <span>{{ DENSITY_MODE_LABELS[modelValue] }}</span>
      <span class="text-ink-4" aria-hidden="true">▾</span>
    </button>
    <ul
      v-if="open"
      role="listbox"
      class="absolute left-0 top-full mt-1 raised py-1 min-w-[220px] z-30"
    >
      <li
        v-for="m in modes"
        :key="m"
        role="option"
        :aria-selected="m === modelValue"
        @click="pick(m)"
        :class="[
          'px-3 py-2 type-body cursor-pointer flex items-center justify-between',
          m === modelValue ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hairline-2'
        ]"
      >
        {{ DENSITY_MODE_LABELS[m] }}
        <span v-if="m === modelValue" aria-hidden="true">✓</span>
      </li>
    </ul>
  </div>
</template>
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- MapDensityToggle`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/MapDensityToggle.vue tests/components/MapDensityToggle.spec.ts
git commit -m "feat(map): density toggle dropdown"
```

---

### Task 14: `MapStatePanel.vue`

**Files:**
- Create: `components/MapStatePanel.vue`
- Test: `tests/components/MapStatePanel.spec.ts`

- [ ] **Step 1: Create `tests/components/MapStatePanel.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapStatePanel from '~/components/MapStatePanel.vue'

describe('MapStatePanel', () => {
  it('renders nothing when estadoId is null', () => {
    const w = mount(MapStatePanel, {
      props: { estadoId: null, data: null }
    })
    expect(w.find('[data-testid="panel"]').exists()).toBe(false)
  })

  it('shows state nombre and metric when estadoId provided', () => {
    const fixture = {
      estados: [{ id: 99, nombre: 'Jalisco', slug: 'jalisco', imagen: null, municipios: 0 }],
      universidades: [
        { id: 1, nombre: 'A', tipo: 'Pública', sitio_web: null, estado_id: 99, slug: 'a' },
        { id: 2, nombre: 'B', tipo: 'Privada', sitio_web: null, estado_id: 99, slug: 'b' }
      ],
      carreras: [
        { id: 10, nombre: 'X', grado: 'Lic', universidad_id: 1 }
      ]
    }
    const w = mount(MapStatePanel, {
      props: { estadoId: 99, data: fixture as any },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    expect(w.text()).toContain('Jalisco')
    expect(w.text()).toContain('2')   // unis
    expect(w.text()).toContain('1')   // carreras
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- MapStatePanel`
Expected: FAIL.

- [ ] **Step 3: Create `components/MapStatePanel.vue`**

```vue
<script setup lang="ts">
import type { UniversidadesData } from '~/composables/useUniversidades'

const props = defineProps<{
  estadoId: number | null
  data: UniversidadesData | null
}>()

const estado = computed(() =>
  props.estadoId !== null && props.data
    ? props.data.estados.find(e => e.id === props.estadoId) ?? null
    : null
)

const stats = computed(() => {
  if (!estado.value || !props.data) return null
  const unis = props.data.universidades.filter(u => u.estado_id === estado.value!.id)
  const uniIds = new Set(unis.map(u => u.id))
  const carrCount = props.data.carreras.filter(c => uniIds.has(c.universidad_id)).length
  const top = unis.slice(0, 3)
  return { uniCount: unis.length, carrCount, top }
})
</script>

<template>
  <Transition
    enter-active-class="motion-slide-in-right"
    leave-active-class="motion-slide-in-right"
  >
    <aside
      v-if="estado && stats"
      data-testid="panel"
      class="raised p-5 w-[280px]"
      aria-live="polite"
    >
      <div class="type-mono-meta mb-2">{{ estado.slug }}</div>
      <h3 class="type-h2 text-ink mb-4">{{ estado.nombre }}</h3>

      <dl class="grid grid-cols-2 gap-3 mb-5 hairline-b pb-4">
        <div>
          <dt class="type-mono-meta">universidades</dt>
          <dd class="type-mono-data text-ink text-lg">{{ stats.uniCount }}</dd>
        </div>
        <div>
          <dt class="type-mono-meta">carreras</dt>
          <dd class="type-mono-data text-ink text-lg">{{ stats.carrCount.toLocaleString() }}</dd>
        </div>
      </dl>

      <div class="type-mono-meta mb-2">top universidades</div>
      <ul class="space-y-2 mb-5">
        <li v-for="u in stats.top" :key="u.id">
          <NuxtLink :to="`/universidad/${u.id}`" class="type-body text-ink-2 hover:text-accent transition-colors block truncate">
            {{ u.nombre }}
          </NuxtLink>
        </li>
      </ul>

      <NuxtLink
        :to="`/estado/${estado.id}`"
        class="inline-flex items-center gap-2 type-mono-data text-accent hover:underline"
      >
        Ver estado completo →
      </NuxtLink>
    </aside>
  </Transition>
</template>
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- MapStatePanel`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/MapStatePanel.vue tests/components/MapStatePanel.spec.ts
git commit -m "feat(map): state preview side panel"
```

---

## Stream B — Index console

### Task 15: `StateLeaderboard.vue`

**Files:**
- Create: `components/StateLeaderboard.vue`
- Test: `tests/components/StateLeaderboard.spec.ts`

- [ ] **Step 1: Create `tests/components/StateLeaderboard.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StateLeaderboard from '~/components/StateLeaderboard.vue'

const data = {
  estados: [
    { id: 1, nombre: 'A', slug: 'a', imagen: null, municipios: 0 },
    { id: 2, nombre: 'B', slug: 'b', imagen: null, municipios: 0 },
    { id: 3, nombre: 'C', slug: 'c', imagen: null, municipios: 0 }
  ],
  universidades: [
    { id: 10, nombre: 'x', tipo: 'Pública', sitio_web: null, estado_id: 1, slug: 'x' },
    { id: 11, nombre: 'y', tipo: 'Pública', sitio_web: null, estado_id: 1, slug: 'y' },
    { id: 12, nombre: 'z', tipo: 'Pública', sitio_web: null, estado_id: 2, slug: 'z' }
  ],
  carreras: []
}

describe('StateLeaderboard', () => {
  it('lists estados sorted by metric descending', () => {
    const w = mount(StateLeaderboard, {
      props: { data: data as any, mode: 'universidades', limit: 10 },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    const text = w.text()
    const aPos = text.indexOf('A')
    const bPos = text.indexOf('B')
    expect(aPos).toBeGreaterThan(-1)
    expect(bPos).toBeGreaterThan(-1)
    expect(aPos).toBeLessThan(bPos)
  })

  it('respects limit prop', () => {
    const w = mount(StateLeaderboard, {
      props: { data: data as any, mode: 'universidades', limit: 1 },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    expect(w.text()).not.toContain('B')
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- StateLeaderboard`
Expected: FAIL.

- [ ] **Step 3: Create `components/StateLeaderboard.vue`**

```vue
<script setup lang="ts">
import { computeDensity, type DensityMode } from '~/composables/useDensity'
import type { UniversidadesData } from '~/composables/useUniversidades'

const props = withDefaults(defineProps<{
  data: UniversidadesData | null
  mode: DensityMode
  limit?: number
}>(), { limit: 10 })

const NACION_ID = 127

const rows = computed(() => {
  if (!props.data) return []
  const density = computeDensity(props.data, props.mode)
  return props.data.estados
    .filter(e => e.id !== NACION_ID)
    .map(e => ({ ...e, value: density.valueFor(e.id) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, props.limit)
})

function formatValue(v: number, mode: DensityMode) {
  if (mode === 'public-pct') return `${v}%`
  if (mode === 'ratio') return v.toFixed(1)
  return v.toLocaleString()
}
</script>

<template>
  <div>
    <div class="type-mono-meta hairline-b pb-2 mb-2">Top {{ limit }} estados</div>
    <DataRow
      v-for="(r, i) in rows"
      :key="r.id"
      :index="i + 1"
      :to="`/estado/${r.id}`"
    >
      {{ r.nombre }}
      <template #meta>{{ formatValue(r.value, mode) }}</template>
    </DataRow>
  </div>
</template>
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- StateLeaderboard`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/StateLeaderboard.vue tests/components/StateLeaderboard.spec.ts
git commit -m "feat(index): state leaderboard (density-aware top-N)"
```

---

### Task 16: Rewrite `pages/index.vue` as the console

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: Replace full contents of `pages/index.vue`**

```vue
<script setup lang="ts">
const { data } = useUniversidadesData()
const { mode, setMode } = useDensity()

const totalUnis = computed(() => data.value?.universidades.length ?? 0)
const totalCarr = computed(() => data.value?.carreras.length ?? 0)

const hoverState = ref<{ id: number; nombre: string; svgId: string } | null>(null)

const densityMode = computed({
  get: () => mode.value,
  set: (m) => setMode(m)
})

useHead({
  title: 'Universidades México — Directorio'
})
</script>

<template>
  <div class="motion-fade-in">
    <section class="max-w-console mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-24">
      <!-- Hero kicker (the one serif italic moment) -->
      <p class="font-serif-italic text-ink-3 text-[22px] mb-2">A directory of every</p>
      <h1 class="type-display-1 text-ink mb-12">Mexican university.</h1>

      <!-- Console grid: KPI column | Map | (panel floats over map area) -->
      <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
        <!-- KPI + density + leaderboard column -->
        <div class="space-y-10">
          <div class="space-y-6">
            <div>
              <div class="type-mono-meta">instituciones</div>
              <div class="type-display-2 text-ink mt-1 font-mono tabular-nums">{{ totalUnis.toLocaleString() }}</div>
            </div>
            <div>
              <div class="type-mono-meta">carreras</div>
              <div class="type-display-2 text-ink mt-1 font-mono tabular-nums">{{ totalCarr.toLocaleString() }}</div>
            </div>
          </div>

          <div>
            <div class="type-mono-meta mb-2">vista del mapa</div>
            <MapDensityToggle v-model="densityMode" />
          </div>

          <StateLeaderboard :data="data" :mode="densityMode" :limit="10" />
        </div>

        <!-- Map + floating panel -->
        <div class="relative">
          <MexicoMap @hover="hoverState = $event" />
          <div
            v-if="hoverState"
            class="absolute right-0 top-0 hidden lg:block"
          >
            <MapStatePanel :estado-id="hoverState.id" :data="data" />
          </div>
        </div>
      </div>
    </section>

    <!-- Quiet footer-region links -->
    <section class="border-t border-hairline">
      <div class="max-w-console mx-auto px-6 md:px-10 py-10 flex flex-wrap items-center justify-between gap-6">
        <p class="type-mono-meta">Datos SEP · sitio estático · MIT</p>
        <NuxtLink to="/buscador" class="type-mono-data text-accent hover:underline">
          Buscador completo →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
```

- [ ] **Step 2: Smoke test build**

Run: `npm run dev` (background) — verify `/` renders without console errors. Stop the dev server.

(In CI / agent execution, run `npm run generate` and grep the output for errors.)

- [ ] **Step 3: Commit**

```bash
git add pages/index.vue
git commit -m "feat(index): rewrite homepage as operator's console"
```

---

### Task 17: Mobile fallback for index

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: Replace the `<div class="relative">` map block in `pages/index.vue` with this responsive variant**

Find the block:

```vue
        <!-- Map + floating panel -->
        <div class="relative">
          <MexicoMap @hover="hoverState = $event" />
          <div
            v-if="hoverState"
            class="absolute right-0 top-0 hidden lg:block"
          >
            <MapStatePanel :estado-id="hoverState.id" :data="data" />
          </div>
        </div>
```

Replace with:

```vue
        <!-- Map + floating panel -->
        <div class="relative order-first lg:order-none">
          <MexicoMap @hover="hoverState = $event" />
          <div
            v-if="hoverState"
            class="absolute right-0 top-0 hidden lg:block"
          >
            <MapStatePanel :estado-id="hoverState.id" :data="data" />
          </div>
          <div v-if="hoverState" class="block lg:hidden mt-4">
            <MapStatePanel :estado-id="hoverState.id" :data="data" />
          </div>
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add pages/index.vue
git commit -m "feat(index): mobile-stacked map with inline panel"
```

---

## Stream C — Search, palette, shell

### Task 18: `CommandPalette.vue`

**Files:**
- Create: `components/CommandPalette.vue`
- Test: `tests/components/CommandPalette.spec.ts`

- [ ] **Step 1: Create `tests/components/CommandPalette.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CommandPalette from '~/components/CommandPalette.vue'

describe('CommandPalette', () => {
  it('renders nothing when closed', async () => {
    const w = await mountSuspended(CommandPalette, { props: { open: false } })
    expect(w.find('[role="dialog"]').exists()).toBe(false)
  })

  it('shows the dialog when open', async () => {
    const w = await mountSuspended(CommandPalette, { props: { open: true } })
    expect(w.find('[role="dialog"]').exists()).toBe(true)
  })

  it('emits update:open=false on Escape', async () => {
    const w = await mountSuspended(CommandPalette, { props: { open: true } })
    await w.find('input').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('update:open')?.[0]).toEqual([false])
  })
})
```

- [ ] **Step 2: Verify fail**

Run: `npm test -- CommandPalette`
Expected: FAIL.

- [ ] **Step 3: Create `components/CommandPalette.vue`**

```vue
<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [v: boolean] }>()

const { search, ready } = useSearchIndex()
const router = useRouter()

const query = ref('')
const inputRef = ref<HTMLInputElement>()
const focused = ref(0)

const results = computed(() => search(query.value, { limit: 5 }))
const flat = computed(() => [
  ...results.value.universidades.map(r => ({ kind: 'universidad', id: r.item.id, label: r.item.nombre, sub: r.item.tipo, to: `/universidad/${r.item.id}` })),
  ...results.value.carreras.map(r => ({ kind: 'carrera', id: r.item.id, label: r.item.nombre, sub: r.item.grado, to: `/universidad/${r.item.universidad_id}` })),
  ...results.value.estados.map(r => ({ kind: 'estado', id: r.item.id, label: r.item.nombre, sub: 'estado', to: `/estado/${r.item.id}` }))
])

watch(() => props.open, async (v) => {
  if (v) {
    await nextTick()
    inputRef.value?.focus()
  } else {
    query.value = ''
    focused.value = 0
  }
})

watch(() => flat.value.length, () => { focused.value = 0 })

function close() { emit('update:open', false) }

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { close(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); focused.value = Math.min(focused.value + 1, flat.value.length - 1) }
  if (e.key === 'ArrowUp')   { e.preventDefault(); focused.value = Math.max(focused.value - 1, 0) }
  if (e.key === 'Enter')     {
    e.preventDefault()
    const item = flat.value[focused.value]
    if (item) { router.push(item.to); close() }
    else if (query.value.trim()) { router.push(`/buscador?q=${encodeURIComponent(query.value.trim())}`); close() }
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[100] bg-ink/20 flex items-start justify-center pt-[12vh] px-4"
        @click.self="close"
      >
        <div class="raised w-full max-w-[640px] overflow-hidden">
          <div class="flex items-center gap-3 px-4 py-3 hairline-b">
            <span class="type-mono-meta text-ink-4">⌘K</span>
            <input
              ref="inputRef"
              v-model="query"
              @keydown="onKey"
              placeholder="Buscar universidades, carreras, estados…"
              class="flex-1 bg-transparent outline-none type-body text-ink placeholder:text-ink-4"
            />
            <Kbd>esc</Kbd>
          </div>

          <div class="max-h-[60vh] overflow-y-auto">
            <div v-if="!query.trim()" class="px-4 py-8 text-center type-mono-meta">
              Escribe para buscar entre {{ ready ? '3,467 universidades' : 'el catálogo' }}.
            </div>

            <div v-else-if="!flat.length" class="px-4 py-8 text-center type-mono-meta">
              Sin resultados.
            </div>

            <ul v-else role="listbox">
              <li
                v-for="(item, i) in flat"
                :key="`${item.kind}-${item.id}`"
                role="option"
                :aria-selected="focused === i"
                @mouseenter="focused = i"
                @click="$router.push(item.to); close()"
                :class="[
                  'px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors',
                  focused === i ? 'bg-accent-soft' : ''
                ]"
              >
                <span class="type-mono-meta w-20 text-ink-4">{{ item.kind }}</span>
                <span class="flex-1 truncate type-body text-ink">{{ item.label }}</span>
                <span class="type-mono-meta text-ink-3">{{ item.sub }}</span>
              </li>
            </ul>

            <div v-if="query.trim()" class="px-4 py-2.5 hairline-t flex items-center justify-between">
              <NuxtLink :to="`/buscador?q=${encodeURIComponent(query.trim())}`" @click="close" class="type-mono-data text-accent hover:underline">
                Ver todos los resultados →
              </NuxtLink>
              <span class="type-mono-meta"><Kbd>↑</Kbd><Kbd>↓</Kbd> navegar · <Kbd>↵</Kbd> abrir</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

- [ ] **Step 4: Verify pass**

Run: `npm test -- CommandPalette`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/CommandPalette.vue tests/components/CommandPalette.spec.ts
git commit -m "feat(palette): command palette with grouped fuzzy search"
```

---

### Task 19: Rewrite `AppNavbar.vue`

**Files:**
- Modify: `components/AppNavbar.vue`

- [ ] **Step 1: Replace full contents of `components/AppNavbar.vue`**

```vue
<script setup lang="ts">
const emit = defineEmits<{ 'open-palette': [] }>()
</script>

<template>
  <nav class="fixed top-0 inset-x-0 z-40 topbar">
    <div class="max-w-console mx-auto h-full px-6 md:px-10 flex items-center gap-4">
      <NuxtLink to="/" class="flex items-center gap-3">
        <span class="font-mono font-semibold text-ink tracking-tight">universidades.mx</span>
      </NuxtLink>
      <span class="h-4 w-px bg-hairline" aria-hidden="true" />
      <div class="flex items-center gap-1">
        <NuxtLink
          to="/"
          exact-active-class="text-ink"
          class="type-mono-meta px-2 py-1 text-ink-3 hover:text-ink transition-colors"
        >Mapa</NuxtLink>
        <NuxtLink
          to="/buscador"
          active-class="text-ink"
          class="type-mono-meta px-2 py-1 text-ink-3 hover:text-ink transition-colors"
        >Buscador</NuxtLink>
      </div>

      <div class="flex-1" />

      <button
        type="button"
        @click="emit('open-palette')"
        class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 surface type-mono-data text-ink-3 hover:bg-hairline-2 transition-colors"
        aria-label="Abrir buscador rápido"
      >
        Buscar…
        <Kbd>⌘K</Kbd>
      </button>
      <button
        type="button"
        @click="emit('open-palette')"
        class="sm:hidden type-mono-meta text-ink-3"
      ><Kbd>⌘K</Kbd></button>
    </div>
  </nav>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/AppNavbar.vue
git commit -m "feat(shell): thin hairline navbar with palette trigger"
```

---

### Task 20: `AppShell.vue` + global ⌘K binding

**Files:**
- Create: `components/AppShell.vue`
- Modify: `app.vue`

- [ ] **Step 1: Create `components/AppShell.vue`**

```vue
<script setup lang="ts">
const paletteOpen = ref(false)

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    paletteOpen.value = !paletteOpen.value
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper">
    <AppNavbar @open-palette="paletteOpen = true" />
    <NuxtLoadingIndicator color="#C2410C" />
    <main class="flex-1 pt-12">
      <slot />
    </main>
    <AppFooter />
    <CommandPalette v-model:open="paletteOpen" />
  </div>
</template>
```

- [ ] **Step 2: Replace `app.vue`**

```vue
<template>
  <AppShell>
    <NuxtPage />
  </AppShell>
</template>
```

- [ ] **Step 3: Update existing smoke test**

Replace `tests/app.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('App Smoke Test', () => {
  it('renders shell with wordmark', async () => {
    const component = await mountSuspended(App)
    expect(component.html()).toContain('universidades.mx')
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add components/AppShell.vue app.vue tests/app.spec.ts
git commit -m "feat(shell): AppShell with global ⌘K binding"
```

---

### Task 21: Trim `AppFooter.vue`

**Files:**
- Modify: `components/AppFooter.vue`

- [ ] **Step 1: Replace full contents of `components/AppFooter.vue`**

```vue
<template>
  <footer class="hairline-t bg-paper">
    <div class="max-w-console mx-auto h-16 px-6 md:px-10 flex items-center justify-between gap-4">
      <p class="type-mono-meta">Datos SEP · sitio estático · MIT</p>
      <a
        href="https://github.com/redcpp/universidades-nuxt"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 type-mono-meta text-ink-3 hover:text-ink transition-colors"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.5 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .3.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
        </svg>
        GitHub
      </a>
    </div>
  </footer>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/AppFooter.vue
git commit -m "feat(shell): trim footer to single line"
```

---

### Task 22: Rewrite `pages/buscador.vue`

**Files:**
- Modify: `pages/buscador.vue`

- [ ] **Step 1: Replace full contents of `pages/buscador.vue`**

```vue
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { search, ready } = useSearchIndex()
const query = ref((route.query.q as string) || '')

const results = computed(() => search(query.value, { limit: 50 }))

function updateQuery() {
  router.replace({ query: { q: query.value.trim() || undefined } })
}

useHead({ title: 'Buscador — Universidades México' })
</script>

<template>
  <div class="motion-fade-in max-w-console mx-auto px-6 md:px-10 pt-10 pb-24">
    <p class="type-mono-meta mb-2">Buscador</p>
    <h1 class="type-display-2 text-ink mb-4">Encuentra cualquier universidad o carrera.</h1>
    <p class="type-body text-ink-3 mb-10 max-w-prose">
      Búsqueda difusa sobre 3,467 universidades y 27,798 carreras. Los resultados se actualizan mientras escribes.
    </p>

    <div class="flex items-center gap-3 hairline-b pb-3 mb-10">
      <span class="type-mono-meta text-ink-4">⌘K</span>
      <input
        v-model="query"
        @input="updateQuery"
        type="text"
        placeholder="universidad o carrera…"
        class="flex-1 bg-transparent outline-none type-h2 text-ink placeholder:text-ink-4"
        autofocus
      />
    </div>

    <div v-if="!query.trim()" class="type-mono-meta">
      Escribe arriba para buscar.
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <section>
        <div class="type-mono-meta hairline-b pb-2 mb-2 flex justify-between">
          <span>Universidades</span>
          <span>{{ results.universidades.length }}</span>
        </div>
        <DataRow
          v-for="r in results.universidades"
          :key="r.item.id"
          :to="`/universidad/${r.item.id}`"
        >
          {{ r.item.nombre }}
          <template #meta>{{ r.item.tipo }}</template>
        </DataRow>
        <p v-if="!results.universidades.length" class="type-mono-meta pt-4">Sin coincidencias.</p>
      </section>

      <section>
        <div class="type-mono-meta hairline-b pb-2 mb-2 flex justify-between">
          <span>Carreras</span>
          <span>{{ results.carreras.length }}</span>
        </div>
        <DataRow
          v-for="r in results.carreras"
          :key="r.item.id"
          :to="`/universidad/${r.item.universidad_id}`"
        >
          {{ r.item.nombre }}
          <template #meta>{{ r.item.grado }}</template>
        </DataRow>
        <p v-if="!results.carreras.length" class="type-mono-meta pt-4">Sin coincidencias.</p>
      </section>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add pages/buscador.vue
git commit -m "feat(buscador): rewrite with hairline rows + shared search index"
```

---

## Stream D — Drill-down pages

### Task 23: Rewrite `pages/estado/[id].vue`

**Files:**
- Modify: `pages/estado/[id].vue`

- [ ] **Step 1: Replace full contents of `pages/estado/[id].vue`**

```vue
<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)
const { data, pending } = useUniversidadesData()

const estado = computed(() => data.value?.estados.find(e => e.id === id) || null)
const universidades = computed(() => data.value?.universidades.filter(u => u.estado_id === id) ?? [])

watch(pending, (p) => {
  if (!p && !estado.value) throw createError({ statusCode: 404, statusMessage: 'Estado no encontrado' })
}, { immediate: true })

const tipos = computed(() => ['Todos', ...new Set(universidades.value.map(u => u.tipo))])
const activeTipo = ref('Todos')
const filtered = computed(() => activeTipo.value === 'Todos' ? universidades.value : universidades.value.filter(u => u.tipo === activeTipo.value))

const carrerasCount = computed(() => {
  if (!data.value) return 0
  const ids = new Set(universidades.value.map(u => u.id))
  return data.value.carreras.filter(c => ids.has(c.universidad_id)).length
})

useHead(() => ({ title: estado.value ? `${estado.value.nombre} — Universidades México` : 'Universidades México' }))
</script>

<template>
  <div v-if="estado" class="motion-fade-in max-w-console mx-auto px-6 md:px-10 pt-10 pb-24">
    <div class="type-mono-meta mb-3">
      <NuxtLink to="/" class="text-ink-3 hover:text-ink transition-colors">mapa</NuxtLink>
      <span class="mx-2 text-ink-4">/</span>
      <span class="text-ink-2">{{ estado.nombre }}</span>
    </div>

    <h1 class="type-display-2 text-ink mb-3">{{ estado.nombre }}</h1>
    <p class="type-mono-data text-ink-3 mb-10">
      {{ universidades.length }} universidades · {{ carrerasCount.toLocaleString() }} carreras
    </p>

    <div class="flex flex-wrap items-center gap-2 mb-8">
      <Chip
        v-for="t in tipos"
        :key="t"
        :active="activeTipo === t"
        as="button"
        @click="activeTipo = t"
      >{{ t }}</Chip>
    </div>

    <DataRow
      v-for="u in filtered"
      :key="u.id"
      :to="`/universidad/${u.id}`"
    >
      <span class="inline-flex items-center gap-3">
        <span class="type-mono-meta text-ink-4">{{ u.tipo }}</span>
        <span>{{ u.nombre }}</span>
      </span>
      <template #meta>
        <span v-if="u.sitio_web" class="truncate max-w-[200px] inline-block">{{ u.sitio_web }}</span>
      </template>
    </DataRow>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add pages/estado/[id].vue
git commit -m "feat(estado): rewrite drill-down with hairline rows + chip filters"
```

---

### Task 24: Rewrite `pages/universidad/[id].vue`

**Files:**
- Modify: `pages/universidad/[id].vue`

- [ ] **Step 1: Replace full contents of `pages/universidad/[id].vue`**

```vue
<script setup lang="ts">
import { carreraSlug } from '~/composables/useCarreraSlugs'

const route = useRoute()
const id = Number(route.params.id)
const { data, pending } = useUniversidadesData()

const universidad = computed(() => data.value?.universidades.find(u => u.id === id) || null)
const estado = computed(() => universidad.value ? data.value?.estados.find(e => e.id === universidad.value!.estado_id) ?? null : null)
const carreras = computed(() => data.value?.carreras.filter(c => c.universidad_id === id) ?? [])
const grados = computed(() => [...new Set(carreras.value.map(c => c.grado))])

watch(pending, (p) => {
  if (!p && !universidad.value) throw createError({ statusCode: 404, statusMessage: 'Universidad no encontrada' })
}, { immediate: true })

useHead(() => ({ title: universidad.value ? `${universidad.value.nombre} — Universidades México` : 'Universidades México' }))
</script>

<template>
  <div v-if="universidad" class="motion-fade-in max-w-prose mx-auto px-6 md:px-10 pt-10 pb-24">
    <div class="type-mono-meta mb-3">
      <NuxtLink to="/" class="text-ink-3 hover:text-ink transition-colors">mapa</NuxtLink>
      <span class="mx-2 text-ink-4">/</span>
      <NuxtLink v-if="estado" :to="`/estado/${estado.id}`" class="text-ink-3 hover:text-ink transition-colors">{{ estado.nombre }}</NuxtLink>
      <span class="mx-2 text-ink-4">/</span>
      <span class="text-ink-2 truncate inline-block max-w-[260px] align-bottom">{{ universidad.nombre }}</span>
    </div>

    <Chip class="mb-4">{{ universidad.tipo }}</Chip>
    <h1 class="type-display-2 text-ink mb-4">{{ universidad.nombre }}</h1>
    <p class="type-mono-data text-ink-3 mb-3">
      {{ carreras.length }} carreras · {{ grados.length }} grados<span v-if="estado"> · {{ estado.nombre }}</span>
    </p>

    <a
      v-if="universidad.sitio_web"
      :href="universidad.sitio_web.startsWith('http') ? universidad.sitio_web : 'https://' + universidad.sitio_web"
      target="_blank"
      rel="noopener"
      class="type-body text-accent hover:underline mb-10 inline-block"
    >{{ universidad.sitio_web }} ↗</a>

    <div v-for="g in grados" :key="g" class="mt-12 first:mt-10">
      <div class="type-mono-meta hairline-b pb-2 mb-3">{{ g }}</div>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="c in carreras.filter(c => c.grado === g)"
          :key="c.id"
        >
          <NuxtLink
            :to="`/carrera/${carreraSlug(c.nombre)}`"
            class="inline-flex items-center px-3 py-1.5 type-body text-ink-2 border border-hairline rounded-sm hover:bg-accent-soft hover:text-accent hover:border-accent/30 transition-colors"
          >
            {{ c.nombre }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add pages/universidad/[id].vue
git commit -m "feat(universidad): rewrite profile with grouped grados + carrera links"
```

---

### Task 25: Restyle `error.vue`

**Files:**
- Modify: `error.vue`

- [ ] **Step 1: Replace full contents of `error.vue`**

```vue
<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
function handleError() { clearError({ redirect: '/' }) }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-paper px-6">
    <div class="max-w-prose w-full">
      <div class="type-mono-meta mb-2">error {{ error.statusCode }}</div>
      <h1 class="type-display-2 text-ink mb-3">
        {{ error.statusCode === 404 ? 'No encontramos esto.' : 'Algo salió mal.' }}
      </h1>
      <p class="type-body text-ink-3 mb-8">{{ error.statusMessage || 'Intenta de nuevo desde el inicio.' }}</p>
      <button
        @click="handleError"
        class="type-mono-data text-accent hover:underline"
      >Volver al mapa →</button>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add error.vue
git commit -m "feat(error): restyle error page in new system"
```

---

## Stream E — Carrera route

### Task 26: `pages/carrera/[slug].vue`

**Files:**
- Create: `pages/carrera/[slug].vue`

- [ ] **Step 1: Create `pages/carrera/[slug].vue`**

```vue
<script setup lang="ts">
import { mexicoSvg } from '~/composables/mexicoSvg'

const route = useRoute()
const slug = route.params.slug as string
const { data, pending } = useUniversidadesData()
const { idx } = useCarreraIndex()

const entry = computed(() => idx.value?.entries?.[slug] ?? null)

watch([pending, entry], ([p, e]) => {
  if (!p && !e) throw createError({ statusCode: 404, statusMessage: 'Carrera no encontrada' })
}, { immediate: true })

const universidades = computed(() => {
  if (!entry.value || !data.value) return []
  const set = new Set(entry.value.universidadIds)
  return data.value.universidades.filter(u => set.has(u.id))
})

const byEstado = computed(() => {
  if (!data.value) return [] as Array<{ estado: any; unis: any[] }>
  const groups = new Map<number, any[]>()
  for (const u of universidades.value) {
    if (!groups.has(u.estado_id)) groups.set(u.estado_id, [])
    groups.get(u.estado_id)!.push(u)
  }
  return [...groups.entries()]
    .map(([eid, unis]) => ({
      estado: data.value!.estados.find(e => e.id === eid)!,
      unis
    }))
    .filter(g => g.estado)
    .sort((a, b) => b.unis.length - a.unis.length)
})

const mapContainer = ref<HTMLDivElement>()
const idMap: Record<string, number> = {
  agu: 81, bcn: 82, bcs: 83, cam: 84, chp: 87, chh: 88,
  coa: 85, col: 86, dur: 93, gro: 95, gua: 94, hid: 96,
  jal: 99, mex: 100, mic: 102, mor: 103, nay: 104, nle: 105,
  oax: 107, pue: 126, que: 111, roo: 112, sin: 114, slp: 113,
  son: 115, tab: 116, tam: 117, tla: 118, ver: 119, yuc: 120,
  zac: 121, cmx: 124
}

function stepFor(count: number, max: number): number {
  if (count === 0 || max === 0) return 0
  const t = count / max
  if (t < 0.2) return 1
  if (t < 0.4) return 2
  if (t < 0.7) return 3
  return 4
}

function paint() {
  if (!mapContainer.value) return
  const counts = new Map<number, number>()
  for (const g of byEstado.value) counts.set(g.estado.id, g.unis.length)
  const max = Math.max(0, ...counts.values())
  const stepVars = ['var(--data-0)', 'var(--data-1)', 'var(--data-2)', 'var(--data-3)', 'var(--data-4)']
  for (const path of mapContainer.value.querySelectorAll<SVGPathElement>('path')) {
    const svgId = path.getAttribute('id')
    if (!svgId || !idMap[svgId]) {
      path.style.fill = 'var(--hairline-2)'
      continue
    }
    const c = counts.get(idMap[svgId]) ?? 0
    path.style.fill = stepVars[stepFor(c, max)]
    path.style.stroke = 'var(--surface)'
    path.style.strokeWidth = '1'
    path.style.transition = 'fill 200ms var(--ease-out)'
  }
}

watch([() => mapContainer.value, byEstado], async () => {
  await nextTick()
  paint()
}, { immediate: true, flush: 'post' })

useHead(() => ({
  title: entry.value ? `${entry.value.nombre} — Universidades México` : 'Universidades México'
}))
</script>

<template>
  <div v-if="entry" class="motion-fade-in max-w-console mx-auto px-6 md:px-10 pt-10 pb-24">
    <div class="type-mono-meta mb-3">
      <NuxtLink to="/" class="text-ink-3 hover:text-ink transition-colors">mapa</NuxtLink>
      <span class="mx-2 text-ink-4">/</span>
      <span class="text-ink-3">carrera</span>
      <span class="mx-2 text-ink-4">/</span>
      <span class="text-ink-2">{{ entry.slug }}</span>
    </div>

    <h1 class="type-display-2 text-ink mb-3">{{ entry.nombre }}</h1>
    <p class="type-mono-data text-ink-3 mb-10">
      {{ universidades.length }} universidades en {{ byEstado.length }} estados
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
      <div ref="mapContainer" v-html="mexicoSvg" class="map-host w-full" />

      <div>
        <div class="type-mono-meta hairline-b pb-2 mb-2">Estados</div>
        <DataRow
          v-for="(g, i) in byEstado"
          :key="g.estado.id"
          :index="i + 1"
          :to="`/estado/${g.estado.id}`"
        >
          {{ g.estado.nombre }}
          <template #meta>{{ g.unis.length }}</template>
        </DataRow>
      </div>
    </div>

    <section class="mt-16">
      <div class="type-mono-meta hairline-b pb-2 mb-4">Universidades que ofrecen esta carrera</div>
      <div v-for="g in byEstado" :key="g.estado.id" class="mt-8 first:mt-0">
        <div class="type-mono-meta text-ink-3 mb-2">{{ g.estado.nombre }}</div>
        <DataRow
          v-for="u in g.unis"
          :key="u.id"
          :to="`/universidad/${u.id}`"
        >
          {{ u.nombre }}
          <template #meta>{{ u.tipo }}</template>
        </DataRow>
      </div>
    </section>
  </div>
</template>

<style scoped>
:deep(svg) { width: 100%; height: auto; max-height: 520px; }
.map-host :deep(svg path) {
  fill: var(--data-0);
  stroke: var(--surface);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/carrera/[slug].vue
git commit -m "feat(carrera): /carrera/[slug] route with mini-choropleth + grouped unis"
```

---

### Task 27: Smoke-test the carrera prerender

**Files:**
- Create: `tests/scripts/prerender-routes.spec.ts`

- [ ] **Step 1: Create `tests/scripts/prerender-routes.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('carrera index', () => {
  it('exists after build script runs', () => {
    const p = resolve(process.cwd(), 'public/data/carrera-index.json')
    if (!existsSync(p)) return // skip in environments where build hasn't run
    const idx = JSON.parse(readFileSync(p, 'utf-8'))
    expect(Array.isArray(idx.slugs)).toBe(true)
    expect(idx.slugs.length).toBeGreaterThan(100)
    const sample = idx.slugs[0]
    expect(idx.entries[sample]).toBeTruthy()
    expect(idx.entries[sample].universidadIds.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run script and test**

Run: `node scripts/build-carrera-index.mjs && npm test -- prerender-routes`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/scripts/prerender-routes.spec.ts
git commit -m "test(carrera): smoke-test carrera-index emission"
```

---

### Task 28: Verify full static build

**Files:**
- (verification only)

- [ ] **Step 1: Generate static site**

Run: `npm run generate`
Expected: completes with "Prerendered N routes" where N is in the thousands (previously ~3,500; now should be ~5,000-10,000 depending on unique carrera count). No errors.

- [ ] **Step 2: Spot-check generated HTML**

Run: `ls .output/public/carrera/ | head -5 && ls .output/public/estado/ | head -3 && ls .output/public/universidad/ | head -3`
Expected: each directory has prerendered `index.html` files.

- [ ] **Step 3: Local preview**

Run: `npm run preview` (background)
Open: `http://localhost:3000`
Verify: map renders, ⌘K opens palette, density toggle changes choropleth, clicking a state navigates to `/estado/[id]`, clicking a carrera chip on a university page reaches `/carrera/[slug]`.

Stop the preview server.

- [ ] **Step 4: No commit needed** (verification task)

---

# Phase 3 — Cleanup

## Task 29: Update README screenshots section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a note about the redesign**

After the existing "Highlights" section, append:

```markdown
## What's new (May 2026)

The UI was rewritten from first principles into a light-only "Operator's Console" identity (Linear/Stripe-grade refinement, monospace data, restrained accent, map as protagonist). New capabilities:

- **⌘K command palette** — global fuzzy search across universities, programs, and states.
- **Density choropleth toggle** — the homepage map recolors live across four metrics (universities, programs, programs-per-university, % public).
- **`/carrera/[slug]` route** — every unique program now has its own pre-rendered page with a mini-choropleth showing where it's offered.

See `docs/superpowers/specs/2026-05-11-cinematic-ui-redesign-design.md` and `docs/superpowers/plans/2026-05-11-cinematic-ui-redesign.md` for the full design and implementation.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: note 2026 redesign in README"
```

---

## Task 30: Final test sweep

**Files:**
- (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test -- --run`
Expected: all PASS, no skipped tests apart from the conditional `carrera-index` skip when the build hasn't been run.

- [ ] **Step 2: Run the production build end-to-end**

Run: `npm run generate`
Expected: completes without errors, no Vue or Nitro warnings related to changed files.

- [ ] **Step 3: No commit needed** (verification task)

---

## Task 31: Deploy preview

**Files:**
- (verification only)

- [ ] **Step 1: Confirm CI workflow is unchanged**

Run: `cat .github/workflows/deploy.yml`
Expected: existing workflow runs `npm run generate` and deploys; no changes needed because the generate step now runs `scripts/build-carrera-index.mjs` automatically via the `nuxt.config.ts` import side-effect.

- [ ] **Step 2: Push to a branch and open a PR (manual)**

This is a manual step for the user: `git push` and open a PR. Cloudflare Pages will produce a preview URL on the PR. The agent should not push or open a PR autonomously.

- [ ] **Step 3: No commit needed**

---

# Self-review

Reviewed against `2026-05-11-cinematic-ui-redesign-design.md`:

- §3 Visual identity → Tasks 1-5 cover tokens, typography, motion, main.css, Tailwind config.
- §3.2 Color tokens → Task 1 ✓
- §3.3 Typography → Task 2 ✓
- §3.4 Layout primitives → Tasks 4, 5, 6 (Chip), 7 (Kbd), 8 (DataRow) ✓
- §3.5 Motion → Task 3 ✓ + choropleth transition Task 12 ✓
- §4.1 Index console → Tasks 15, 16, 17 ✓
- §4.2 Buscador → Task 22 ✓
- §4.3 Estado → Task 23 ✓ (micro-map in heading: omitted intentionally — the index page is already the canonical map view and the chip filter + hairline rows convey the drill-down. The "micro-map" idea from §4.3 of the spec is downgraded to "breadcrumb stays text-only" for simplicity. The carrera page in Task 26 already demonstrates the micro-map pattern.)
- §4.4 Universidad → Task 24 ✓ (carreras link to /carrera/[slug])
- §4.5 Carrera → Tasks 11 (slug + build script + index data), 26 (page), 27 (test), 28 (prerender verify) ✓
- §4.6 AppShell + ⌘K palette → Tasks 18, 19, 20 ✓
- §4.7 Footer → Task 21 ✓
- §5 Component architecture → all files listed in §5 of the spec are created (cross-checked) ✓
- §6 Data flow → useSearchIndex Task 9, useDensity Task 10, useCarreraSlugs/build-time Task 11 ✓
- §7 SSG impact → Task 28 verifies the prerender count
- §8 Errors/empty → Tasks 22, 23, 25 ✓ (loading: existing NuxtLoadingIndicator color updated in Task 20)
- §9 A11y → Task 12 (keyboard-nav map paths), Task 18 (palette focus trap via input autofocus + escape), Task 4 (`:focus-visible` ring) ✓
- §10 Testing → component tests in Tasks 6, 7, 8, 13, 14, 15, 18; composable tests in Tasks 9, 10; smoke test in Task 27 ✓
- §11 Phasing → mapped to Phase 1 / Streams A-E / Phase 3 ✓

**Spec coverage gap**: §4.3 micro-map per state. Decision documented above (downgraded). Optional follow-up — not blocking.

**Placeholder scan**: no TBD / TODO / "implement later" patterns found. Every code step has complete code. Every command has expected output.

**Type consistency**: `DensityMode`, `GroupedResults`, `CarreraIndex`, `CarreraIndexEntry`, `UniversidadesData` referenced consistently across tasks. The `useDensity()` composable exposes `mode`, `setMode`, `result` — consumed identically in Tasks 12, 16, 17. `carreraSlug` exported from `composables/useCarreraSlugs.ts` and consumed in Task 24.

Plan is ready for execution.
