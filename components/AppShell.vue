<script setup lang="ts">
const paletteOpen = ref(false)

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    paletteOpen.value = !paletteOpen.value
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper">
    <AppNavbar @open-palette="paletteOpen = true" />
    <NuxtLoadingIndicator color="#C2410C" />
    <main class="flex-1 pt-12">
      <slot />
    </main>
    <AppFooter />
    <CommandPalette v-model:open="paletteOpen" />
  </div>
</template>
