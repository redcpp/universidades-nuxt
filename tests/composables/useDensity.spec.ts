import { describe, it, expect } from 'vitest'
import { computeDensity } from '~/composables/useDensity'

const fixture = {
  estados: [
    { id: 1, nombre: 'A', slug: 'a', imagen: null, municipios: 0 },
    { id: 2, nombre: 'B', slug: 'b', imagen: null, municipios: 0 }
  ],
  universidades: [
    { id: 10, nombre: 'U1', tipo: 'Pública',  sitio_web: null, estado_id: 1, slug: 'u1' },
    { id: 11, nombre: 'U2', tipo: 'Privada',  sitio_web: null, estado_id: 1, slug: 'u2' },
    { id: 12, nombre: 'U3', tipo: 'Pública',  sitio_web: null, estado_id: 2, slug: 'u3' }
  ],
  carreras: [
    { id: 100, nombre: 'X', grado: 'Lic', universidad_id: 10 },
    { id: 101, nombre: 'Y', grado: 'Lic', universidad_id: 10 },
    { id: 102, nombre: 'Z', grado: 'Lic', universidad_id: 12 }
  ]
}

describe('computeDensity', () => {
  it('counts universidades per estado', () => {
    const d = computeDensity(fixture as any, 'universidades')
    expect(d.valueFor(1)).toBe(2)
    expect(d.valueFor(2)).toBe(1)
    expect(d.max).toBe(2)
  })

  it('counts carreras per estado', () => {
    const d = computeDensity(fixture as any, 'carreras')
    expect(d.valueFor(1)).toBe(2)
    expect(d.valueFor(2)).toBe(1)
  })

  it('computes carreras-per-uni ratio', () => {
    const d = computeDensity(fixture as any, 'ratio')
    expect(d.valueFor(1)).toBe(1) // 2 carreras / 2 unis
    expect(d.valueFor(2)).toBe(1) // 1 carrera / 1 uni
  })

  it('computes percent public', () => {
    const d = computeDensity(fixture as any, 'public-pct')
    expect(d.valueFor(1)).toBe(50)
    expect(d.valueFor(2)).toBe(100)
  })

  it('assigns a step 0-4 via .stepFor()', () => {
    const richFixture = {
      estados: [
        { id: 1, nombre: 'A', slug: 'a', imagen: null, municipios: 0 },
        { id: 2, nombre: 'B', slug: 'b', imagen: null, municipios: 0 },
        { id: 3, nombre: 'C', slug: 'c', imagen: null, municipios: 0 },
        { id: 4, nombre: 'D', slug: 'd', imagen: null, municipios: 0 }
      ],
      universidades: [
        // estado 1: 10 unis (t=1.0 → step 4)
        ...Array.from({ length: 10 }, (_, i) => ({ id: 100 + i, nombre: `u${i}`, tipo: 'Pública', sitio_web: null, estado_id: 1, slug: `u${i}` })),
        // estado 2: 5 unis  (t=0.5 → step 3, since 0.5 in [0.4, 0.7))
        ...Array.from({ length: 5 }, (_, i) => ({ id: 200 + i, nombre: `v${i}`, tipo: 'Pública', sitio_web: null, estado_id: 2, slug: `v${i}` })),
        // estado 3: 1 uni   (t=0.1 → step 1)
        { id: 300, nombre: 'w', tipo: 'Pública', sitio_web: null, estado_id: 3, slug: 'w' }
        // estado 4: 0 unis  (t=0 → step 0)
      ],
      carreras: []
    }
    const d = computeDensity(richFixture as any, 'universidades')
    expect(d.stepFor(1)).toBe(4)  // t=1.0
    expect(d.stepFor(2)).toBe(3)  // t=0.5
    expect(d.stepFor(3)).toBe(1)  // t=0.1
    expect(d.stepFor(4)).toBe(0)  // no value
    expect(d.stepFor(999)).toBe(0)  // unknown id
  })
})
