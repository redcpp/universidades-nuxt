import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

execSync('node scripts/build-carrera-index.mjs', { stdio: 'inherit' })

export default defineNuxtConfig({
  compatibilityDate: '2026-05-14',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  vite: {
    server: {
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.nuxt/**',
          '**/.output/**',
          '**/.wrangler/**',
          '**/dist/**',
          '**/public/data/**',
          '**/public/screenshots/**'
        ]
      }
    }
  },
  watchers: {
    chokidar: {
      ignoreInitial: true,
      followSymlinks: false,
      ignored: /(?:^|[\\/])(?:node_modules|\.git|\.nuxt|\.output|\.wrangler|dist)(?:[\\/]|$)|[\\/]public[\\/](?:data|screenshots)(?:[\\/]|$)/
    }
  },
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
  experimental: {
    payloadExtraction: false
  },
  nitro: {
    prerender: {
      routes: ['/', '/buscador']
    }
  },
  hooks: {
    'nitro:init': (nitro) => {
      nitro.hooks.hook('prerender:routes', async (routes) => {
        const dataPath = resolve(process.cwd(), 'public/data/universidades.json')
        const idxPath = resolve(process.cwd(), 'public/data/carrera-index.json')

        const data = JSON.parse(readFileSync(dataPath, 'utf-8'))

        for (const e of data.estados) {
          routes.add(`/estado/${e.id}`)
        }
        for (const u of data.universidades) {
          routes.add(`/universidad/${u.id}`)
        }

        if (existsSync(idxPath)) {
          const idx = JSON.parse(readFileSync(idxPath, 'utf-8'))
          for (const s of idx.slugs) {
            routes.add(`/carrera/${s}`)
          }
        }
      })
    }
  }
})
