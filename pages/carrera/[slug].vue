<script setup lang="ts">
import { mexicoSvg } from '~/composables/mexicoSvg'

const route = useRoute()
const slug = route.params.slug as string
const { data, pending } = useUniversidadesData()
const { idx } = useCarreraIndex()

const entry = computed(() => idx.value?.entries?.[slug] ?? null)
const idxLoaded = computed(() => (idx.value?.slugs?.length ?? 0) > 0)

watch([idxLoaded, entry], ([loaded, e]) => {
  if (loaded && !e) throw createError({ statusCode: 404, statusMessage: 'Carrera no encontrada' })
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
