<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { search, ready } = useSearchIndex()
const query = ref((route.query.q as string) || '')

const results = computed(() => search(query.value, { limit: 50 }))

function updateQuery() {
  router.replace({ query: { q: query.value.trim() || undefined } })
}

useHead({ title: 'Buscador — Universidades México' })
</script>

<template>
  <div class="motion-fade-in max-w-console mx-auto px-6 md:px-10 pt-10 pb-24">
    <p class="type-mono-meta mb-2">Buscador</p>
    <h1 class="type-display-2 text-ink mb-4">Encuentra cualquier universidad o carrera.</h1>
    <p class="type-body text-ink-3 mb-10 max-w-prose">
      Búsqueda difusa sobre 3,467 universidades y 27,798 carreras. Los resultados se actualizan mientras escribes.
    </p>

    <div class="flex items-center gap-3 hairline-b pb-3 mb-10">
      <span class="type-mono-meta text-ink-4">⌘K</span>
      <input
        v-model="query"
        @input="updateQuery"
        type="text"
        placeholder="universidad o carrera…"
        class="flex-1 bg-transparent outline-none type-h2 text-ink placeholder:text-ink-4"
        autofocus
      />
    </div>

    <div v-if="!query.trim()" class="type-mono-meta">
      Escribe arriba para buscar.
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <section>
        <div class="type-mono-meta hairline-b pb-2 mb-2 flex justify-between">
          <span>Universidades</span>
          <span>{{ results.universidades.length }}</span>
        </div>
        <DataRow
          v-for="r in results.universidades"
          :key="r.item.id"
          :to="`/universidad/${r.item.id}`"
        >
          {{ r.item.nombre }}
          <template #meta>{{ r.item.tipo }}</template>
        </DataRow>
        <p v-if="!results.universidades.length" class="type-mono-meta pt-4">Sin coincidencias.</p>
      </section>

      <section>
        <div class="type-mono-meta hairline-b pb-2 mb-2 flex justify-between">
          <span>Carreras</span>
          <span>{{ results.carreras.length }}</span>
        </div>
        <DataRow
          v-for="r in results.carreras"
          :key="r.item.slug"
          :to="`/carrera/${r.item.slug}`"
        >
          {{ r.item.nombre }}
          <template #meta>{{ r.item.grado }} · {{ r.item.count }}</template>
        </DataRow>
        <p v-if="!results.carreras.length" class="type-mono-meta pt-4">Sin coincidencias.</p>
      </section>
    </div>
  </div>
</template>
