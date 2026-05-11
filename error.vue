<template>
  <div class="min-h-screen flex flex-col gradient-hero">
    <AppNavbar />
    <main class="flex-1 flex items-center justify-center pt-16 px-4">
      <div class="text-center max-w-lg mx-auto animate-fade-in">
        <div class="text-8xl mb-6 animate-float">⚠️</div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ title }}
        </h1>
        <p class="text-lg text-slate-300 mb-8">
          {{ message }}
        </p>
        <NuxtLink to="/" class="btn-primary text-lg px-8 py-4">
          Volver al inicio
        </NuxtLink>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<ErrorProps>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() =>
  is404.value ? 'Página no encontrada' : 'Algo salió mal'
)

const message = computed(() => {
  if (is404.value) {
    return 'Lo sentimos, no pudimos encontrar la página que buscas. Puede haber sido movida o eliminada.'
  }
  return props.error.statusMessage || props.error.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.'
})
</script>
