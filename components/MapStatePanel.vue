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
  const top = [...unis]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    .slice(0, 3)
  return { uniCount: unis.length, carrCount, top }
})
</script>

<template>
  <Transition
    enter-active-class="motion-slide-in-right"
    leave-active-class="motion-slide-out-right"
  >
    <aside
      v-if="estado && stats"
      data-testid="panel"
      class="raised p-5 w-[280px]"
    >
      <div class="type-mono-meta mb-2">{{ estado.slug }}</div>
      <h3 class="type-h2 text-ink mb-4">{{ estado.nombre }}</h3>

      <dl class="grid grid-cols-2 gap-3 mb-5 hairline-b pb-4">
        <div>
          <dt class="type-mono-meta">universidades</dt>
          <dd class="type-mono-data text-ink text-lg">{{ stats.uniCount.toLocaleString() }}</dd>
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
