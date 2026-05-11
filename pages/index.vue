<script setup lang="ts">
const { data, pending, error } = useUniversidadesData()

const totalUniversidades = computed(() => data.value?.universidades.length ?? 0)
const totalCarreras = computed(() => data.value?.carreras.length ?? 0)
const totalEstados = computed(() => data.value?.estados.length ?? 0)

const estadosConCount = computed(() => {
  if (!data.value) return []
  return data.value.estados
    .filter(e => e.id !== 127) // exclude NACION
    .map(e => ({
      ...e,
      count: data.value!.universidades.filter(u => u.estado_id === e.id).length
    }))
    .sort((a, b) => b.count - a.count)
})

const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/buscador?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

useHead({
  title: 'Universidades México — Directorio de Universidades y Carreras'
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 gradient-mesh opacity-60" />
      <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -3s" />
      
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="animate-fade-in">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-blue-300 text-sm font-medium mb-8">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Datos actualizados de la SEP
          </div>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up stagger-1">
          Encuentra tu<br>
          <span class="text-gradient">universidad ideal</span>
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto animate-slide-up stagger-2">
          Directorio completo con <span class="text-white font-semibold">{{ totalUniversidades.toLocaleString() }}</span> universidades 
          y <span class="text-white font-semibold">{{ totalCarreras.toLocaleString() }}</span> carreras en México
        </p>
        
        <form @submit.prevent="handleSearch" class="max-w-2xl mx-auto animate-slide-up stagger-3">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <div class="relative flex items-center bg-white rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
              <div class="pl-5 text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar universidad o carrera..."
                class="flex-1 px-4 py-5 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-lg"
              />
              <button type="submit" class="m-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Stats -->
    <section class="section-padding bg-white relative -mt-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card-hover p-8 text-center relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            <div class="relative">
              <div class="text-5xl font-black text-slate-900 mb-2">{{ totalEstados - 1 }}</div>
              <div class="text-slate-500 font-medium uppercase tracking-wider text-sm">Estados</div>
            </div>
          </div>
          <div class="card-hover p-8 text-center relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            <div class="relative">
              <div class="text-5xl font-black text-slate-900 mb-2">{{ totalUniversidades.toLocaleString() }}</div>
              <div class="text-slate-500 font-medium uppercase tracking-wider text-sm">Universidades</div>
            </div>
          </div>
          <div class="card-hover p-8 text-center relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
            <div class="relative">
              <div class="text-5xl font-black text-slate-900 mb-2">{{ totalCarreras.toLocaleString() }}</div>
              <div class="text-slate-500 font-medium uppercase tracking-wider text-sm">Carreras</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mapa -->
    <section class="section-padding bg-slate-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Explora por Estado</h2>
          <p class="text-slate-500 text-lg max-w-xl mx-auto">Haz clic en cualquier estado del mapa para descubrir las universidades disponibles</p>
        </div>
        <div class="card p-8 md:p-12 shadow-xl shadow-slate-900/5">
          <MexicoMap />
        </div>
      </div>
    </section>

    <!-- Estados Grid -->
    <section class="section-padding bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Todos los Estados</h2>
          <p class="text-slate-500 text-lg">Selecciona un estado de la lista</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <NuxtLink
            v-for="estado in estadosConCount"
            :key="estado.id"
            :to="`/estado/${estado.id}`"
            class="card-hover p-5 text-center group"
          >
            <div class="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{{ estado.nombre }}</div>
            <div class="text-xs text-slate-400 font-medium">{{ estado.count }} universidades</div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
