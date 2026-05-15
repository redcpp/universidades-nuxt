<script setup lang="ts">
const emit = defineEmits<{ 'open-palette': [] }>()
</script>

<template>
  <nav class="fixed top-0 inset-x-0 z-40 topbar">
    <div class="max-w-console mx-auto h-full px-6 md:px-10 flex items-center gap-4">
      <NuxtLink to="/" class="flex items-center gap-3">
        <span class="font-mono font-semibold text-ink tracking-tight">universidades.mx</span>
      </NuxtLink>
      <span class="h-4 w-px bg-hairline" aria-hidden="true" />
      <div class="flex items-center gap-1">
        <NuxtLink
          to="/"
          exact-active-class="text-ink"
          class="type-mono-meta px-2 py-1 text-ink-3 hover:text-ink transition-colors"
        >Mapa</NuxtLink>
        <NuxtLink
          to="/buscador"
          active-class="text-ink"
          class="type-mono-meta px-2 py-1 text-ink-3 hover:text-ink transition-colors"
        >Buscador</NuxtLink>
      </div>

      <div class="flex-1" />

      <button
        type="button"
        @click="emit('open-palette')"
        class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 surface type-mono-data text-ink-3 hover:bg-hairline-2 transition-colors"
        aria-label="Abrir buscador rápido"
      >
        Buscar…
        <Kbd>⌘K</Kbd>
      </button>
      <button
        type="button"
        @click="emit('open-palette')"
        class="sm:hidden type-mono-meta text-ink-3"
      ><Kbd>⌘K</Kbd></button>
    </div>
  </nav>
</template>
