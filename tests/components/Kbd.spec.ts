import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Kbd from '~/components/Kbd.vue'

describe('Kbd', () => {
  it('renders the keys slot', () => {
    const w = mount(Kbd, { slots: { default: '⌘K' } })
    expect(w.text()).toBe('⌘K')
    expect(w.element.tagName).toBe('KBD')
  })
})
