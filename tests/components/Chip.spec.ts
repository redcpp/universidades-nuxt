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

  it('binds href when rendered as anchor', () => {
    const w = mount(Chip, {
      props: { as: 'a', href: '/carrera/medicina' },
      slots: { default: 'Medicina' }
    })
    expect(w.element.tagName).toBe('A')
    expect(w.attributes('href')).toBe('/carrera/medicina')
  })

  it('does not bind href when not an anchor', () => {
    const w = mount(Chip, {
      props: { as: 'span', href: '/should-be-ignored' },
      slots: { default: 'x' }
    })
    expect(w.attributes('href')).toBeUndefined()
  })

  it('emits click events when as=button', async () => {
    const w = mount(Chip, { props: { as: 'button' }, slots: { default: 'x' } })
    await w.trigger('click')
    expect(w.emitted('click')?.length).toBe(1)
    expect(w.attributes('type')).toBe('button')
  })
})
