import { describe, it, expect } from 'vitest'
import { carreraSlug } from '~/composables/useCarreraSlugs'

describe('carreraSlug', () => {
  it('strips diacritics', () => {
    expect(carreraSlug('Médico Cirujano')).toBe('medico-cirujano')
  })
  it('collapses non-alphanum to single dashes', () => {
    expect(carreraSlug('Ing. en Sistemas / Cómputo')).toBe('ing-en-sistemas-computo')
  })
  it('trims leading/trailing dashes', () => {
    expect(carreraSlug('-X-')).toBe('x')
  })
})
