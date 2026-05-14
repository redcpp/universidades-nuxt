import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Chip from '~/components/Chip.vue'

describe('Chip', () => {
  it('renders slot content', () => {
    const w = mount(Chip, { slots: { default: 'Pública' } })
    expect(w.text()).toBe('Pública')
  })

  it('applies active state classes when active', () => {
    const w = mount(Chip, { props: { active: true }, slots: { default: 'x' } })
    expect(w.classes()).toContain('bg-accent-soft')
  })

  it('renders as a button when interactive', () => {
    const w = mount(Chip, { props: { as: 'button' }, slots: { default: 'x' } })
    expect(w.element.tagName).toBe('BUTTON')
  })
})
