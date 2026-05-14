<script setup lang="ts">
import { DENSITY_MODE_LABELS, type DensityMode } from '~/composables/useDensity'

const props = defineProps<{ modelValue: DensityMode }>()
const emit = defineEmits<{ 'update:modelValue': [m: DensityMode] }>()

const open = ref(false)
const modes = Object.keys(DENSITY_MODE_LABELS) as DensityMode[]
const wrapper = ref<HTMLDivElement>()
const triggerRef = ref<HTMLButtonElement>()
const focusedIndex = ref(0)

function openMenu() {
  open.value = true
  focusedIndex.value = modes.indexOf(props.modelValue)
  if (focusedIndex.value < 0) focusedIndex.value = 0
  nextTick(() => (wrapper.value?.querySelector('ul[role="listbox"]') as HTMLElement | null)?.focus())
}

function closeMenu(returnFocus = true) {
  open.value = false
  if (returnFocus) nextTick(() => triggerRef.value?.focus())
}

function toggleMenu() {
  if (open.value) closeMenu(false)
  else openMenu()
}

function pick(m: DensityMode) {
  emit('update:modelValue', m)
  closeMenu()
}

function onTriggerKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openMenu()
  }
}

function onListKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusedIndex.value = Math.min(focusedIndex.value + 1, modes.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
  } else if (e.key === 'Home') {
    e.preventDefault()
    focusedIndex.value = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    focusedIndex.value = modes.length - 1
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    pick(modes[focusedIndex.value])
  }
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
      ref="triggerRef"
      type="button"
      @click="toggleMenu"
      @keydown="onTriggerKey"
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
      tabindex="-1"
      @keydown="onListKey"
      class="absolute left-0 top-full mt-1 raised py-1 min-w-[220px] z-30 outline-none"
    >
      <li
        v-for="(m, i) in modes"
        :key="m"
        role="option"
        :aria-selected="m === modelValue"
        @click="pick(m)"
        @mouseenter="focusedIndex = i"
        :class="[
          'px-3 py-2 type-body cursor-pointer flex items-center justify-between',
          m === modelValue ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:bg-hairline-2',
          focusedIndex === i && m !== modelValue ? 'bg-hairline-2' : ''
        ]"
      >
        {{ DENSITY_MODE_LABELS[m] }}
        <span v-if="m === modelValue" aria-hidden="true">✓</span>
      </li>
    </ul>
  </div>
</template>
