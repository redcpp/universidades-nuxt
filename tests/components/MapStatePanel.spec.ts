import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapStatePanel from '~/components/MapStatePanel.vue'

describe('MapStatePanel', () => {
  it('renders nothing when estadoId is null', () => {
    const w = mount(MapStatePanel, {
      props: { estadoId: null, data: null }
    })
    expect(w.find('[data-testid="panel"]').exists()).toBe(false)
  })

  it('shows state nombre, localized stats, and alphabetically-sorted top universities', () => {
    const fixture = {
      estados: [{ id: 99, nombre: 'Jalisco', slug: 'jalisco', imagen: null, municipios: 0 }],
      universidades: [
        { id: 1, nombre: 'Zeta', tipo: 'Pública', sitio_web: null, estado_id: 99, slug: 'zeta' },
        { id: 2, nombre: 'Beta', tipo: 'Privada', sitio_web: null, estado_id: 99, slug: 'beta' },
        { id: 3, nombre: 'Alfa', tipo: 'Pública', sitio_web: null, estado_id: 99, slug: 'alfa' },
        { id: 4, nombre: 'Other', tipo: 'Pública', sitio_web: null, estado_id: 88, slug: 'other' }
      ],
      carreras: [
        { id: 10, nombre: 'X', grado: 'Lic', universidad_id: 1 }
      ]
    }
    const w = mount(MapStatePanel, {
      props: { estadoId: 99, data: fixture as any },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    const dds = w.findAll('dd')
    expect(dds[0].text()).toBe('3')   // uniCount
    expect(dds[1].text()).toBe('1')   // carrCount
    expect(w.text()).toContain('Jalisco')
    const liTexts = w.findAll('li').map(li => li.text())
    expect(liTexts).toEqual(['Alfa', 'Beta', 'Zeta'])  // alphabetical, top 3 of 3 in-state
  })
})
