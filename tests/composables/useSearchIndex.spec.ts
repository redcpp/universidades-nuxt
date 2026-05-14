import { describe, it, expect } from 'vitest'
import { buildSearchIndex } from '~/composables/useSearchIndex'

const fixture = {
  estados: [{ id: 1, nombre: 'Jalisco', slug: 'jalisco', imagen: null, municipios: 0 }],
  universidades: [
    { id: 10, nombre: 'Universidad de Guadalajara', tipo: 'Pública', sitio_web: null, estado_id: 1, slug: 'udg' }
  ],
  carreras: [
    { id: 100, nombre: 'Medicina', grado: 'Licenciatura', universidad_id: 10 }
  ]
}

describe('buildSearchIndex', () => {
  it('returns grouped results for a matching query', () => {
    const idx = buildSearchIndex(fixture as any)
    const r = idx.search('medicina')
    expect(r.carreras.length).toBeGreaterThan(0)
    expect(r.carreras[0].item.nombre).toBe('Medicina')
  })

  it('returns empty groups for blank query', () => {
    const idx = buildSearchIndex(fixture as any)
    const r = idx.search('')
    expect(r.universidades.length).toBe(0)
    expect(r.carreras.length).toBe(0)
    expect(r.estados.length).toBe(0)
  })

  it('limits each group via the limit option', () => {
    const idx = buildSearchIndex(fixture as any)
    const r = idx.search('universidad', { limit: 1 })
    expect(r.universidades.length).toBeLessThanOrEqual(1)
  })
})
