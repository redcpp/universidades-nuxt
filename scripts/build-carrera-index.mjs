import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const data = JSON.parse(readFileSync(resolve(root, 'public/data/universidades.json'), 'utf-8'))

function slug(nombre) {
  return nombre
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const entries = {}
const uniById = new Map(data.universidades.map(u => [u.id, u]))

for (const c of data.carreras) {
  if (!c.nombre || !c.nombre.trim()) continue
  const s = slug(c.nombre)
  if (!s) continue
  const uni = uniById.get(c.universidad_id)
  if (!entries[s]) {
    entries[s] = {
      slug: s,
      nombre: c.nombre,
      carreraIds: [],
      universidadIds: [],
      estadoIds: []
    }
  }
  entries[s].carreraIds.push(c.id)
  if (uni) {
    if (!entries[s].universidadIds.includes(uni.id)) entries[s].universidadIds.push(uni.id)
    if (!entries[s].estadoIds.includes(uni.estado_id)) entries[s].estadoIds.push(uni.estado_id)
  }
}

const slugs = Object.keys(entries).sort()
const out = { slugs, entries }

writeFileSync(resolve(root, 'public/data/carrera-index.json'), JSON.stringify(out))
console.log(`[build-carrera-index] ${slugs.length} unique carrera slugs`)
