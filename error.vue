<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>()
function handleError() { clearError({ redirect: '/' }) }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-paper px-6">
    <div class="max-w-prose w-full">
      <div class="type-mono-meta mb-2">error {{ error.statusCode }}</div>
      <h1 class="type-display-2 text-ink mb-3">
        {{ error.statusCode === 404 ? 'No encontramos esto.' : 'Algo salió mal.' }}
      </h1>
      <p class="type-body text-ink-3 mb-8">{{ error.statusMessage || 'Intenta de nuevo desde el inicio.' }}</p>
      <button
        @click="handleError"
        class="type-mono-data text-accent hover:underline"
      >Volver al mapa →</button>
    </div>
  </div>
</template>
