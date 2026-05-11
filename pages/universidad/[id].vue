<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)

const { data, pending, error } = useUniversidadesData()

const universidad = computed(() => data.value?.universidades.find(u => u.id === id) || null)

watch(pending, (isPending) => {
  if (!isPending && !universidad.value) {
    throw createError({ statusCode: 404, statusMessage: 'Universidad no encontrada' })
  }
}, { immediate: true })

const estado = computed(() => {
  if (!universidad.value) return null
  return data.value?.estados.find(e => e.id === universidad.value!.estado_id) || null
})

const carreras = computed(() => data.value?.carreras.filter(c => c.universidad_id === id) ?? [])

const grados = computed(() => [...new Set(carreras.value.map(c => c.grado))])

useHead(() => ({
  title: universidad.value ? `${universidad.value.nombre} — Universidades México` : 'Universidades México'
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

    <template v-else-if="universidad">
      <!-- Hero -->
      <section class="gradient-hero pt-32 pb-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-2 text-blue-300 text-sm mb-6">
            <NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <NuxtLink v-if="estado" :to="`/estado/${estado.id}`" class="hover:text-white transition-colors">{{ estado.nombre }}</NuxtLink>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="text-white">{{ universidad.nombre }}</span>
          </div>
          
          <span class="inline-block px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-4 backdrop-blur-sm">
            {{ universidad.tipo }}
          </span>
          <h1 class="text-4xl md:text-5xl font-black text-white mb-6">{{ universidad.nombre }}</h1>
          
          <div class="flex flex-wrap items-center gap-4">
            <a 
              v-if="universidad.sitio_web"
              :href="universidad.sitio_web.startsWith('http') ? universidad.sitio_web : 'https://' + universidad.sitio_web" 
              target="_blank" 
              rel="noopener"
              class="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              Visitar sitio web
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
            <div class="text-slate-300">
              <span class="text-white font-bold text-2xl">{{ carreras.length }}</span> carreras registradas
            </div>
          </div>
        </div>
      </section>

      <!-- Carreras -->
      <section class="section-padding bg-slate-50 -mt-10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="card p-8 md:p-12 shadow-xl shadow-slate-900/5">
            <h2 class="text-2xl font-bold text-slate-900 mb-8">Carreras disponibles</h2>
            
            <div v-for="grado in grados" :key="grado" class="mb-8 last:mb-0">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{{ grado }}</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="c in carreras.filter(c => c.grado === grado)"
                  :key="c.id"
                  class="px-4 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-sm text-slate-700 transition-colors cursor-default"
                >
                  {{ c.nombre }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
