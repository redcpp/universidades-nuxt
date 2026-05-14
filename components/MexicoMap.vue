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
