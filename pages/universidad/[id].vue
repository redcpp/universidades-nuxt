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
