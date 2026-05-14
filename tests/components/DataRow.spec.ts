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

  it('renders as a NuxtLink when to provided', () => {
    const w = mount(DataRow, {
      props: { to: '/estado/100' },
      slots: { default: 'X' },
      global: { stubs: { NuxtLink: { template: '<a class="stub"><slot /></a>' } } }
    })
    expect(w.find('a.stub').exists()).toBe(true)
  })
})
