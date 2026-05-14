<script setup lang="ts">
const { data } = useUniversidadesData()
const { mode, setMode } = useDensity()

const totalUnis = computed(() => data.value?.universidades.length ?? 0)
const totalCarr = computed(() => data.value?.carreras.length ?? 0)

const hoverState = ref<{ id: number; nombre: string; svgId: string } | null>(null)

const densityMode = computed({
  get: () => mode.value,
  set: (m) => setMode(m)
})

useHead({
  title: 'Universidades México — Directorio'
})
</script>

<template>
  <div class="motion-fade-in">
    <section class="max-w-console mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-24">
      <!-- Hero kicker (the one serif italic moment) -->
      <p class="font-serif-italic text-ink-3 text-[22px] mb-2">A directory of every</p>
      <h1 class="type-display-1 text-ink mb-12">Mexican university.</h1>

      <!-- Console grid: KPI column | Map | (panel floats over map area) -->
      <div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16 items-start">
        <!-- KPI + density + leaderboard column -->
        <div class="space-y-10">
          <div class="space-y-6">
            <div>
              <div class="type-mono-meta">instituciones</div>
              <div class="type-display-2 text-ink mt-1 font-mono tabular-nums">{{ totalUnis.toLocaleString() }}</div>
            </div>
            <div>
              <div class="type-mono-meta">carreras</div>
              <div class="type-display-2 text-ink mt-1 font-mono tabular-nums">{{ totalCarr.toLocaleString() }}</div>
            </div>
          </div>

          <div>
            <div class="type-mono-meta mb-2">vista del mapa</div>
            <MapDensityToggle v-model="densityMode" />
          </div>

          <StateLeaderboard :data="data" :mode="densityMode" :limit="10" />
        </div>

        <!-- Map + floating panel -->
        <div class="relative order-first lg:order-none">
          <MexicoMap @hover="hoverState = $event" />
          <div
            v-if="hoverState"
            class="absolute right-0 top-0 hidden lg:block"
          >
            <MapStatePanel :estado-id="hoverState.id" :data="data" />
          </div>
          <div v-if="hoverState" class="block lg:hidden mt-4">
            <MapStatePanel :estado-id="hoverState.id" :data="data" />
          </div>
        </div>
      </div>
    </section>

    <!-- Quiet footer-region links -->
    <section class="border-t border-hairline">
      <div class="max-w-console mx-auto px-6 md:px-10 py-10 flex flex-wrap items-center justify-between gap-6">
        <p class="type-mono-meta">Datos SEP · sitio estático · MIT</p>
        <NuxtLink to="/buscador" class="type-mono-data text-accent hover:underline">
          Buscador completo →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
