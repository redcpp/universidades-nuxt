<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [v: boolean] }>()

const { search, ready } = useSearchIndex()
const router = useRouter()

const query = ref('')
const inputRef = ref<HTMLInputElement>()
const focused = ref(0)

const results = computed(() => search(query.value, { limit: 5 }))
const flat = computed(() => [
  ...results.value.universidades.map(r => ({ kind: 'universidad', id: r.item.id, label: r.item.nombre, sub: r.item.tipo, to: `/universidad/${r.item.id}` })),
  ...results.value.carreras.map(r => ({ kind: 'carrera', id: r.item.slug, label: r.item.nombre, sub: r.item.grado, to: `/carrera/${r.item.slug}` })),
  ...results.value.estados.map(r => ({ kind: 'estado', id: r.item.id, label: r.item.nombre, sub: 'estado', to: `/estado/${r.item.id}` }))
])

watch(() => props.open, async (v) => {
  if (v) {
    await nextTick()
    inputRef.value?.focus()
  } else {
    query.value = ''
    focused.value = 0
  }
})

watch(() => flat.value.length, () => { focused.value = 0 })

function close() { emit('update:open', false) }

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { close(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); focused.value = Math.min(focused.value + 1, flat.value.length - 1) }
  if (e.key === 'ArrowUp')   { e.preventDefault(); focused.value = Math.max(focused.value - 1, 0) }
  if (e.key === 'Enter')     {
    e.preventDefault()
    const item = flat.value[focused.value]
    if (item) { router.push(item.to); close() }
    else if (query.value.trim()) { router.push(`/buscador?q=${encodeURIComponent(query.value.trim())}`); close() }
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        role="dialog"
        aria-modal="true"
        class="fixed inset-0 z-[100] bg-ink/20 flex items-start justify-center pt-[12vh] px-4"
        @click.self="close"
      >
        <div class="raised w-full max-w-[640px] overflow-hidden">
          <div class="flex items-center gap-3 px-4 py-3 hairline-b">
            <span class="type-mono-meta text-ink-4">⌘K</span>
            <input
              ref="inputRef"
              v-model="query"
              @keydown="onKey"
              placeholder="Buscar universidades, carreras, estados…"
              class="flex-1 bg-transparent outline-none type-body text-ink placeholder:text-ink-4"
            />
            <Kbd>esc</Kbd>
          </div>

          <div class="max-h-[60vh] overflow-y-auto">
            <div v-if="!query.trim()" class="px-4 py-8 text-center type-mono-meta">
              Escribe para buscar entre {{ ready ? '3,467 universidades' : 'el catálogo' }}.
            </div>

            <div v-else-if="!flat.length" class="px-4 py-8 text-center type-mono-meta">
              Sin resultados.
            </div>

            <ul v-else role="listbox">
              <li
                v-for="(item, i) in flat"
                :key="`${item.kind}-${item.id}`"
                role="option"
                :aria-selected="focused === i"
                @mouseenter="focused = i"
                @click="$router.push(item.to); close()"
                :class="[
                  'px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors',
                  focused === i ? 'bg-accent-soft' : ''
                ]"
              >
                <span class="type-mono-meta w-20 text-ink-4">{{ item.kind }}</span>
                <span class="flex-1 truncate type-body text-ink">{{ item.label }}</span>
                <span class="type-mono-meta text-ink-3">{{ item.sub }}</span>
              </li>
            </ul>

            <div v-if="query.trim()" class="px-4 py-2.5 hairline-t flex items-center justify-between">
              <NuxtLink :to="`/buscador?q=${encodeURIComponent(query.trim())}`" @click="close" class="type-mono-data text-accent hover:underline">
                Ver todos los resultados →
              </NuxtLink>
              <span class="type-mono-meta"><Kbd>↑</Kbd><Kbd>↓</Kbd> navegar · <Kbd>↵</Kbd> abrir</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
