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
    if (t < 0.15) return 1
    if (t < 0.3) return 2
    if (t < 0.5) return 3
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
