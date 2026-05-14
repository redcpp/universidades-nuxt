import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StateLeaderboard from '~/components/StateLeaderboard.vue'

const data = {
  estados: [
    { id: 1, nombre: 'A', slug: 'a', imagen: null, municipios: 0 },
    { id: 2, nombre: 'B', slug: 'b', imagen: null, municipios: 0 },
    { id: 3, nombre: 'C', slug: 'c', imagen: null, municipios: 0 }
  ],
  universidades: [
    { id: 10, nombre: 'x', tipo: 'Pública', sitio_web: null, estado_id: 1, slug: 'x' },
    { id: 11, nombre: 'y', tipo: 'Pública', sitio_web: null, estado_id: 1, slug: 'y' },
    { id: 12, nombre: 'z', tipo: 'Pública', sitio_web: null, estado_id: 2, slug: 'z' }
  ],
  carreras: []
}

describe('StateLeaderboard', () => {
  it('lists estados sorted by metric descending', () => {
    const w = mount(StateLeaderboard, {
      props: { data: data as any, mode: 'universidades', limit: 10 },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' }, DataRow: { template: '<div><slot /></div>' } } }
    })
    const text = w.text()
    const aPos = text.indexOf('A')
    const bPos = text.indexOf('B')
    expect(aPos).toBeGreaterThan(-1)
    expect(bPos).toBeGreaterThan(-1)
    expect(aPos).toBeLessThan(bPos)
  })

  it('respects limit prop', () => {
    const w = mount(StateLeaderboard, {
      props: { data: data as any, mode: 'universidades', limit: 1 },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' }, DataRow: { template: '<div><slot /></div>' } } }
    })
    expect(w.text()).not.toContain('B')
  })
})
