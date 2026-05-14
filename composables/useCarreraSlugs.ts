export function carreraSlug(nombre: string): string {
  return nombre
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export interface CarreraIndexEntry {
  slug: string
  nombre: string          // canonical display name (first-seen casing)
  carreraIds: number[]    // ids of all carreras that normalize to this slug
  universidadIds: number[]
  estadoIds: number[]
}

export interface CarreraIndex {
  slugs: string[]
  entries: Record<string, CarreraIndexEntry>
}

export function useCarreraIndex() {
  const { data: idx } = useLazyFetch<CarreraIndex>('/data/carrera-index.json', {
    key: 'carrera-index',
    server: false,
    default: () => ({ slugs: [], entries: {} })
  })
  return { idx }
}
