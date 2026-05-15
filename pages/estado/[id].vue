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
