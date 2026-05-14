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
