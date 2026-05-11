import data from './public/data/universidades.json'

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Universidades México — Directorio de Universidades y Carreras',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Directorio y buscador de universidades y carreras en México. Encuentra instituciones por estado, tipo y programa de estudios.' },
        { property: 'og:title', content: 'Universidades México' },
        { property: 'og:description', content: 'Directorio y buscador de universidades y carreras en México' },
        { property: 'og:image', content: 'https://universidades-mexico.pages.dev/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://universidades-mexico.pages.dev' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/buscador',
        ...data.estados.map((e: any) => `/estado/${e.id}`),
        ...data.universidades.map((u: any) => `/universidad/${u.id}`)
      ]
    }
  }
})