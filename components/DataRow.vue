<script setup lang="ts">
interface Props {
  index?: number
  to: string
}
defineProps<Props>()
const padded = (n?: number) => (n === undefined ? '' : String(n).padStart(2, '0'))
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex items-center gap-4 px-4 py-3 border-b border-hairline last:border-b-0
           hover:bg-accent-soft transition-colors relative"
  >
    <span
      v-if="index !== undefined"
      data-testid="row-index"
      class="type-mono-meta text-ink-4 w-6 tabular-nums"
    >{{ padded(index) }}</span>
    <span class="flex-1 min-w-0 truncate text-ink type-body group-hover:text-accent transition-colors">
      <slot />
    </span>
    <span v-if="$slots.meta" class="type-mono-data text-ink-3 group-hover:text-ink-2 transition-colors">
      <slot name="meta" />
    </span>
    <span
      class="text-ink-4 group-hover:text-accent transition-colors"
      aria-hidden="true"
    >→</span>
  </NuxtLink>
</template>
