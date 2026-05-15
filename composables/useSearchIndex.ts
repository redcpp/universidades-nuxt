import Fuse from 'fuse.js'
import type { FuseResult } from 'fuse.js'
import type { Estado, Universidad, Carrera } from '~/types'
import type { UniversidadesData } from '~/composables/useUniversidades'
import { carreraSlug } from '~/composables/useCarreraSlugs'

export interface CarreraGroup {
  slug: string
  nombre: string
  grado: string
  count: number
}

export interface GroupedResults {
  universidades: FuseResult<Universidad>[]
  carreras: FuseResult<CarreraGroup>[]
  estados: FuseResult<Estado>[]
}

export interface SearchOptions {
  limit?: number
}

export interface SearchIndex {
  search: (query: string, opts?: SearchOptions) => GroupedResults
}

export function buildCarreraGroups(carreras: Carrera[]): CarreraGroup[] {
  const map = new Map<string, CarreraGroup>()
  for (const c of carreras) {
    const slug = carreraSlug(c.nombre)
    if (!slug) continue
    const existing = map.get(slug)
    if (existing) {
      existing.count += 1
    } else {
      map.set(slug, { slug, nombre: c.nombre, grado: c.grado, count: 1 })
    }
  }
  return [...map.values()]
}

export function buildSearchIndex(data: UniversidadesData): SearchIndex {
  const carreraGroups = buildCarreraGroups(data.carreras)
  const fuseUni = new Fuse(data.universidades, { keys: ['nombre', 'tipo'], threshold: 0.4 })
  const fuseCar = new Fuse(carreraGroups, { keys: ['nombre', 'grado'], threshold: 0.4 })
  const fuseEst = new Fuse(data.estados, { keys: ['nombre'], threshold: 0.3 })

  return {
    search(query: string, opts: SearchOptions = {}) {
      const q = query.trim()
      const limit = opts.limit ?? 20
      if (!q) return { universidades: [], carreras: [], estados: [] }
      return {
        universidades: fuseUni.search(q).slice(0, limit),
        carreras: fuseCar.search(q).sort((a, b) => b.item.count - a.item.count).slice(0, limit),
        estados: fuseEst.search(q).slice(0, limit)
      }
    }
  }
}

export function useSearchIndex() {
  const { data } = useUniversidadesData()
  const index = shallowRef<SearchIndex | null>(null)

  watch(
    () => data.value,
    (d) => {
      if (d) index.value = buildSearchIndex(d)
    },
    { immediate: true }
  )

  function search(query: string, opts?: SearchOptions): GroupedResults {
    return index.value?.search(query, opts) ?? { universidades: [], carreras: [], estados: [] }
  }

  return { search, ready: computed(() => index.value !== null) }
}
