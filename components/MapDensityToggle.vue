<script setup lang="ts">
import { DENSITY_MODE_LABELS, type DensityMode } from '~/composables/useDensity'

const props = defineProps<{ modelValue: DensityMode }>()
const emit = defineEmits<{ 'update:modelValue': [m: DensityMode] }>()

const open = ref(false)
const modes = Object.keys(DENSITY_MODE_LABELS) as DensityMode[]
const wrapper = ref<HTMLDivElement>()

function pick(m: DensityMode) {
  emit('update:modelValue', m)
  open.value = false
}

function onDocClick(e: MouseEvent) {
  if (!wrapper.value?.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="wrapper" class="relative inline-block">
    <button
      type="button"
      @click="open = !open"
      class="inline-flex items-center gap-2 px-3 py-1.5 surface text-ink-2 type-mono-data hover:bg-hairline-2 transition-colors"
      :aria-expanded="open"
      aria-haspopup="listbox"
    >
      <span class="type-mono-meta text-ink-4">density</span>
      <span>{{ DENSITY_MODE_LABELS[modelValue] }}</span>
      <span class="text-ink-4" aria-hidden="true">▾</span>
    </button>
    <ul
      v-if="open"
      role="listbox"
      class="absolute left-0 top-full mt-1 raised py-1 min-w-[220px] z-30"
    >
      <li
        v-for="m in modes"
        :key="m"
        role="option"
        :aria-selected="m === modelValue"
        @click="pick(m)"
        :class="[
          'px-3 py-2 type-body cursor-pointer flex items-center justify-between',
          m === modelValue ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hairline-2'
        ]"
      >
        {{ DENSITY_MODE_LABELS[m] }}
        <span v-if="m === modelValue" aria-hidden="true">✓</span>
      </li>
    </ul>
  </div>
</template>
