import Fuse from 'fuse.js'
import type { Estado, Universidad, Carrera } from '~/types'
import type { UniversidadesData } from '~/composables/useUniversidades'

export interface GroupedResults {
  universidades: { item: Universidad; refIndex: number }[]
  carreras: { item: Carrera; refIndex: number }[]
  estados: { item: Estado; refIndex: number }[]
}

export interface SearchOptions {
  limit?: number
}

export interface SearchIndex {
  search: (query: string, opts?: SearchOptions) => GroupedResults
}

export function buildSearchIndex(data: UniversidadesData): SearchIndex {
  const fuseUni = new Fuse(data.universidades, { keys: ['nombre', 'tipo'], threshold: 0.4 })
  const fuseCar = new Fuse(data.carreras, { keys: ['nombre', 'grado'], threshold: 0.4 })
  const fuseEst = new Fuse(data.estados, { keys: ['nombre'], threshold: 0.3 })

  return {
    search(query: string, opts: SearchOptions = {}) {
      const q = query.trim()
      const limit = opts.limit ?? 20
      if (!q) return { universidades: [], carreras: [], estados: [] }
      return {
        universidades: fuseUni.search(q).slice(0, limit) as any,
        carreras: fuseCar.search(q).slice(0, limit) as any,
        estados: fuseEst.search(q).slice(0, limit) as any
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
