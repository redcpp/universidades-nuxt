<script setup lang="ts">
import { mexicoSvg } from '~/composables/mexicoSvg'
import type { Estado } from '~/types'

const mapContainer = ref<HTMLDivElement>()
const tooltip = ref({ show: false, x: 0, y: 0, text: '' })
const hoveredId = ref<string | null>(null)

const { data, pending, error } = useUniversidadesData()

const idMap: Record<string, number> = {
  agu: 81, bcn: 82, bcs: 83, cam: 84, chp: 87, chh: 88,
  coa: 85, col: 86, dur: 93, gro: 95, gua: 94, hid: 96,
  jal: 99, mex: 100, mic: 102, mor: 103, nay: 104, nle: 105,
  oax: 107, pue: 126, que: 111, roo: 112, sin: 114, slp: 113,
  son: 115, tab: 116, tam: 117, tla: 118, ver: 119, yuc: 120,
  zac: 121, cmx: 124
}

const estadoMap = computed(() => {
  if (!data.value) return new Map<number, Estado>()
  return new Map(data.value.estados.map(e => [e.id, e]))
})

function getEstadoInfo(svgId: string) {
  const dbId = idMap[svgId]
  if (!dbId) return null
  const estado = estadoMap.value.get(dbId)
  if (!estado) return null
  const count = data.value?.universidades.filter(u => u.estado_id === dbId).length ?? 0
  return { ...estado, count }
}

onMounted(() => {
  if (!mapContainer.value) return
  const paths = mapContainer.value.querySelectorAll('path')
  paths.forEach(path => {
    const svgId = path.getAttribute('id')
    if (!svgId || !idMap[svgId]) {
      path.style.fill = '#f1f5f9'
      path.style.stroke = '#e2e8f0'
      path.style.strokeWidth = '1.5'
      return
    }

    path.style.cursor = 'pointer'
    path.style.fill = '#e2e8f0'
    path.style.stroke = '#ffffff'
    path.style.strokeWidth = '1.5'
    path.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'

    path.addEventListener('mouseenter', () => {
      hoveredId.value = svgId
      path.style.fill = '#3b82f6'
      path.style.filter = 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4))'
      path.style.transform = 'scale(1.01)'
      path.style.transformOrigin = 'center'
      const info = getEstadoInfo(svgId)
      if (info) {
        tooltip.value = {
          show: true,
          x: (path as any).__mouseX || 0,
          y: (path as any).__mouseY || 0,
          text: `${info.nombre}: ${info.count} universidades`
        }
      }
    })

    path.addEventListener('mousemove', (e) => {
      const rect = mapContainer.value!.getBoundingClientRect()
      tooltip.value.x = e.clientX - rect.left + 15
      tooltip.value.y = e.clientY - rect.top - 15
      ;(path as any).__mouseX = e.clientX - rect.left
      ;(path as any).__mouseY = e.clientY - rect.top
    })

    path.addEventListener('mouseleave', () => {
      hoveredId.value = null
      path.style.fill = '#e2e8f0'
      path.style.filter = 'none'
      path.style.transform = 'scale(1)'
      tooltip.value.show = false
    })

    path.addEventListener('click', () => {
      const dbId = idMap[svgId]
      if (dbId) navigateTo(`/estado/${dbId}`)
    })
  })
})
</script>

<template>
  <div class="relative w-full">
    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-20">
      <div class="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12 text-slate-500">
      Error al cargar el mapa.
    </div>

    <template v-else>
      <div ref="mapContainer" class="w-full" v-html="mexicoSvg" />
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="tooltip.show"
          class="absolute pointer-events-none bg-slate-900 text-white px-4 py-2 rounded-xl shadow-2xl z-20 whitespace-nowrap text-sm font-medium"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          {{ tooltip.text }}
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
:deep(svg) {
  width: 100%;
  height: auto;
  max-height: 550px;
}
:deep(path) {
  vector-effect: non-scaling-stroke;
}
</style>
