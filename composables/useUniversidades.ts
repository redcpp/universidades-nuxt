import type { Estado, Universidad, Carrera } from '~/types'

export interface UniversidadesData {
  estados: Estado[]
  universidades: Universidad[]
  carreras: Carrera[]
}

export function useUniversidadesData() {
  const { data, pending, error } = useLazyFetch<UniversidadesData>('/data/universidades.json', {
    key: 'universidades-data',
    server: false,
    default: () => null as unknown as UniversidadesData,
  })

  return { data, pending, error }
}

export function useEstados(data: UniversidadesData | null) {
  return data?.estados ?? []
}

export function useUniversidades(data: UniversidadesData | null) {
  return data?.universidades ?? []
}

export function useCarreras(data: UniversidadesData | null) {
  return data?.carreras ?? []
}

export function useUniversidadById(data: UniversidadesData | null, id: number) {
  return data?.universidades.find(u => u.id === id) || null
}

export function useEstadoById(data: UniversidadesData | null, id: number) {
  return data?.estados.find(e => e.id === id) || null
}

export function useCarrerasByUniversidad(data: UniversidadesData | null, univId: number) {
  return data?.carreras.filter(c => c.universidad_id === univId) ?? []
}

export function useUniversidadesByEstado(data: UniversidadesData | null, estadoId: number) {
  return data?.universidades.filter(u => u.estado_id === estadoId) ?? []
}
