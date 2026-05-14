import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapDensityToggle from '~/components/MapDensityToggle.vue'

describe('MapDensityToggle', () => {
  it('renders the current mode label', () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' } })
    expect(w.text()).toContain('Universidades')
  })

  it('emits update:modelValue when a new option is chosen', async () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' } })
    await w.find('button').trigger('click')
    const option = w.findAll('[role="option"]')[1]
    await option.trigger('click')
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })
})
