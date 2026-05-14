import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataRow from '~/components/DataRow.vue'

describe('DataRow', () => {
  it('renders index, primary slot, and meta', () => {
    const w = mount(DataRow, {
      props: { index: 7 },
      slots: { default: 'Estado de México', meta: '420' }
    })
    expect(w.text()).toContain('07')
    expect(w.text()).toContain('Estado de México')
    expect(w.text()).toContain('420')
  })

  it('hides index when prop omitted', () => {
    const w = mount(DataRow, { slots: { default: 'X' } })
    expect(w.find('[data-testid="row-index"]').exists()).toBe(false)
  })

  it('forwards to prop when rendered as NuxtLink', () => {
    const w = mount(DataRow, {
      props: { to: '/estado/100' },
      slots: { default: 'X' },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a class="stub" :data-to="to"><slot /></a>'
          }
        }
      }
    })
    const a = w.find('a.stub')
    expect(a.exists()).toBe(true)
    expect(a.attributes('data-to')).toBe('/estado/100')
  })
})
