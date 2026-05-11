<script setup lang="ts">
import Fuse from 'fuse.js'
import type { Universidad, Carrera } from '~/types'

const route = useRoute()
const router = useRouter()

const query = ref((route.query.q as string) || '')
const { data, pending, error } = useUniversidadesData()

const fuseUni = shallowRef<Fuse<Universidad> | null>(null)
const fuseCar = shallowRef<Fuse<Carrera> | null>(null)

watch(() => data.value, (newData) => {
  if (newData) {
    fuseUni.value = new Fuse(newData.universidades, {
      keys: ['nombre', 'tipo'],
      threshold: 0.4,
    })
    fuseCar.value = new Fuse(newData.carreras, {
      keys: ['nombre', 'grado'],
      threshold: 0.4,
    })
  }
}, { immediate: true })

const results = computed(() => {
  const q = query.value.trim()
  if (!q) return { universidades: [], carreras: [] }
  return {
    universidades: fuseUni.value?.search(q).slice(0, 20) ?? [],
    carreras: fuseCar.value?.search(q).slice(0, 30) ?? [],
  }
})

function updateQuery() {
  router.replace({ query: { q: query.value.trim() || undefined } })
}

useHead({
  title: 'Buscador — Universidades México'
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="gradient-hero pt-32 pb-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-black text-white mb-6">Buscador Nacional</h1>
        <p class="text-slate-300 text-lg mb-8">Encuentra universidades y carreras en todo México</p>
        
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div class="relative flex items-center bg-white rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
            <div class="pl-5 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="query"
              @input="updateQuery"
              type="text"
              placeholder="Escribe una universidad o carrera..."
              class="flex-1 px-4 py-5 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-lg"
              autofocus
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Results -->
    <section class="section-padding bg-slate-50 -mt-6">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading -->
        <div v-if="pending" class="text-center py-20">
          <div class="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <p class="text-slate-500 text-lg">Cargando datos...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-slate-500 text-lg">Error al cargar los datos. Intenta recargar la página.</p>
        </div>

        <div v-else-if="!query.trim()" class="text-center py-20">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <p class="text-slate-500 text-lg">Escribe arriba para buscar entre <span class="font-semibold text-slate-700">{{ data?.universidades.length ?? 0 }}</span> universidades y <span class="font-semibold text-slate-700">{{ data?.carreras.length ?? 0 }}</span> carreras</p>
        </div>

        <div v-else>
          <!-- Universidades -->
          <section v-if="results.universidades.length" class="mb-12">
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Universidades
              <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">{{ results.universidades.length }}</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NuxtLink
                v-for="r in results.universidades"
                :key="r.item.id"
                :to="`/universidad/${r.item.id}`"
                class="card-hover p-6 group"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <span class="inline-block px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">{{ r.item.tipo }}</span>
                    <h3 class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{{ r.item.nombre }}</h3>
                  </div>
                  <svg class="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </NuxtLink>
            </div>
          </section>

          <!-- Carreras -->
          <section v-if="results.carreras.length">
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              Carreras
              <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm">{{ results.carreras.length }}</span>
            </h2>
            <div class="flex flex-wrap gap-3">
              <NuxtLink
                v-for="r in results.carreras"
                :key="r.item.id"
                :to="`/universidad/${r.item.universidad_id}`"
                class="px-5 py-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-sm text-slate-700 hover:text-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                <span class="font-medium">{{ r.item.nombre }}</span>
                <span class="text-slate-400 ml-2">— {{ r.item.grado }}</span>
              </NuxtLink>
            </div>
          </section>

          <div v-if="!results.universidades.length && !results.carreras.length" class="text-center py-20">
            <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-slate-500 text-lg">No se encontraron resultados para "<span class="font-semibold text-slate-700">{{ query }}</span>"</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
