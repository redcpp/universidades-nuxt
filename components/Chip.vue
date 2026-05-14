<script setup lang="ts">
interface Props {
  active?: boolean
  as?: 'span' | 'button' | 'a'
  href?: string
}
const props = withDefaults(defineProps<Props>(), { active: false, as: 'span' })
</script>

<template>
  <component
    :is="props.as"
    :href="props.as === 'a' ? props.href : undefined"
    :class="[
      'inline-flex items-center px-2.5 py-1 rounded-sm text-[12px] font-medium border transition-colors',
      'font-mono uppercase tracking-[0.08em]',
      active
        ? 'bg-accent-soft text-accent border-accent/30'
        : 'bg-surface text-ink-3 border-hairline hover:bg-hairline-2'
    ]"
  >
    <slot />
  </component>
</template>
