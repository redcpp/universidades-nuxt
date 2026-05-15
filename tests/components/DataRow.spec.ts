import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataRow from '~/components/DataRow.vue'

const nuxtLinkStub = {
  NuxtLink: {
    props: ['to'],
    template: '<a class="stub" :data-to="to" :href="to"><slot /></a>'
  }
}

describe('DataRow', () => {
  it('renders index, primary slot, and meta', () => {
    const w = mount(DataRow, {
      props: { index: 7, to: '/x' },
      slots: { default: 'Estado de México', meta: '420' },
      global: { stubs: nuxtLinkStub }
    })
    expect(w.text()).toContain('07')
    expect(w.text()).toContain('Estado de México')
    expect(w.text()).toContain('420')
  })

  it('hides index when prop omitted', () => {
    const w = mount(DataRow, {
      props: { to: '/x' },
      slots: { default: 'X' },
      global: { stubs: nuxtLinkStub }
    })
    expect(w.find('[data-testid="row-index"]').exists()).toBe(false)
  })

  it('renders an anchor with the to as href', () => {
    const w = mount(DataRow, {
      props: { to: '/estado/100' },
      slots: { default: 'X' },
      global: { stubs: nuxtLinkStub }
    })
    const a = w.find('a.stub')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('/estado/100')
  })
})
