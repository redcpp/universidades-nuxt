import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapDensityToggle from '~/components/MapDensityToggle.vue'

describe('MapDensityToggle', () => {
  it('renders the current mode label', () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' } })
    expect(w.text()).toContain('Universidades')
  })

  it('emits update:modelValue with the chosen mode on click', async () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' }, attachTo: document.body })
    await w.find('button').trigger('click')
    const options = w.findAll('[role="option"]')
    expect(options.length).toBe(4)
    await options[1].trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['carreras'])
    w.unmount()
  })

  it('closes on Escape and supports arrow-key navigation', async () => {
    const w = mount(MapDensityToggle, { props: { modelValue: 'universidades' }, attachTo: document.body })
    await w.find('button').trigger('click')
    expect(w.findAll('[role="option"]').length).toBe(4)
    const listbox = w.find('[role="listbox"]')
    await listbox.trigger('keydown', { key: 'ArrowDown' })
    await listbox.trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')?.[0]?.[0]).toBe('carreras')
    w.unmount()
  })
})
