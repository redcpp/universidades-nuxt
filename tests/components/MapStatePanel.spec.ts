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

  it('shows state nombre and metric when estadoId provided', () => {
    const fixture = {
      estados: [{ id: 99, nombre: 'Jalisco', slug: 'jalisco', imagen: null, municipios: 0 }],
      universidades: [
        { id: 1, nombre: 'A', tipo: 'Pública', sitio_web: null, estado_id: 99, slug: 'a' },
        { id: 2, nombre: 'B', tipo: 'Privada', sitio_web: null, estado_id: 99, slug: 'b' }
      ],
      carreras: [
        { id: 10, nombre: 'X', grado: 'Lic', universidad_id: 1 }
      ]
    }
    const w = mount(MapStatePanel, {
      props: { estadoId: 99, data: fixture as any },
      global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } }
    })
    expect(w.text()).toContain('Jalisco')
    expect(w.text()).toContain('2')   // unis
    expect(w.text()).toContain('1')   // carreras
  })
})
