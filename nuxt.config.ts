import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import data from './public/data/universidades.json'

execSync('node scripts/build-carrera-index.mjs', { stdio: 'inherit' })

const carreraIndexPath = resolve(process.cwd(), 'public/data/carrera-index.json')
const carreraIndex: { slugs: string[] } = existsSync(carreraIndexPath)
  ? JSON.parse(readFileSync(carreraIndexPath, 'utf-8'))
  : { slugs: [] }

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Universidades México — Directorio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Directorio y buscador de universidades y carreras en México.' },
        { property: 'og:title', content: 'Universidades México' },
        { property: 'og:description', content: 'Directorio y buscador de universidades y carreras en México' },
        { property: 'og:image', content: 'https://universidades-mexico.pages.dev/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://universidades-mexico.pages.dev' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/buscador',
        ...data.estados.map((e: any) => `/estado/${e.id}`),
        ...data.universidades.map((u: any) => `/universidad/${u.id}`),
        ...carreraIndex.slugs.map((s: string) => `/carrera/${s}`)
      ]
    }
  }
})
