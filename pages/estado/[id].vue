<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)

const { data, pending, error } = useUniversidadesData()

const estado = computed(() => data.value?.estados.find(e => e.id === id) || null)
const universidades = computed(() => data.value?.universidades.filter(u => u.estado_id === id) ?? [])

watch(pending, (isPending) => {
  if (!isPending && !estado.value) {
    throw createError({ statusCode: 404, statusMessage: 'Estado no encontrado' })
  }
}, { immediate: true })

const tipos = computed(() => [...new Set(universidades.value.map(u => u.tipo))])

const activeTipo = ref('Todos')
const filtered = computed(() => {
  if (activeTipo.value === 'Todos') return universidades.value
  return universidades.value.filter(u => u.tipo === activeTipo.value)
})

useHead(() => ({
  title: estado.value ? `${estado.value.nombre} — Universidades México` : 'Universidades México'
}))
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
        <p class="text-slate-500 text-lg">Cargando datos...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
      <div class="text-center">
        <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="text-slate-500 text-lg">Error al cargar los datos. Intenta recargar la página.</p>
      </div>
    </div>

    <template v-else-if="estado">
      <!-- Hero Estado -->
      <section class="gradient-hero pt-32 pb-20">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-6 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Volver al inicio
          </NuxtLink>
          <h1 class="text-4xl md:text-6xl font-black text-white mb-4">{{ estado.nombre }}</h1>
          <p class="text-xl text-slate-300">
            <span class="text-white font-semibold">{{ universidades.length }}</span> universidades registradas
          </p>
        </div>
      </section>

      <!-- Filters & List -->
      <section class="section-padding bg-slate-50 -mt-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Filter Pills -->
          <div class="card p-4 mb-8 flex flex-wrap gap-2">
            <button
              @click="activeTipo = 'Todos'"
              :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTipo === 'Todos' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              Todos ({{ universidades.length }})
            </button>
            <button
              v-for="tipo in tipos"
              :key="tipo"
              @click="activeTipo = tipo"
              :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all', activeTipo === tipo ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              {{ tipo }}
            </button>
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <NuxtLink
              v-for="u in filtered"
              :key="u.id"
              :to="`/universidad/${u.id}`"
              class="card-hover p-6 group"
            >
              <div class="flex items-start justify-between mb-3">
                <span class="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {{ u.tipo }}
                </span>
                <svg class="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors mb-2">{{ u.nombre }}</h3>
              <div v-if="u.sitio_web" class="text-sm text-slate-400 truncate">{{ u.sitio_web }}</div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
