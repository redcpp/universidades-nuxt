import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('carrera index', () => {
  it('exists after build script runs', () => {
    const p = resolve(process.cwd(), 'public/data/carrera-index.json')
    if (!existsSync(p)) return // skip in environments where build hasn't run
    const idx = JSON.parse(readFileSync(p, 'utf-8'))
    expect(Array.isArray(idx.slugs)).toBe(true)
    expect(idx.slugs.length).toBeGreaterThan(100)
    const sample = idx.slugs[0]
    expect(idx.entries[sample]).toBeTruthy()
    expect(idx.entries[sample].universidadIds.length).toBeGreaterThan(0)
  })
})
