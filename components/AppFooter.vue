<template>
  <footer class="bg-slate-900 text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5z"/>
              </svg>
            </div>
            <span class="text-lg font-bold text-white">Universidades México</span>
          </div>
          <p class="text-sm leading-relaxed">
            Directorio completo de universidades y carreras en México. Datos de la Secretaría de Educación Pública.
          </p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Explorar</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink></li>
            <li><NuxtLink to="/buscador" class="hover:text-white transition-colors">Buscador</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Datos</h4>
          <ul class="space-y-2 text-sm">
            <li>33 estados</li>
            <li>3,467 universidades</li>
            <li>27,798 carreras</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <p>Datos de la SEP · Sitio estático con Nuxt 3 + Tailwind CSS</p>
        <a
          href="https://github.com/redcpp/universidades-nuxt"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.5 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .3.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
          </svg>
          Ver código en GitHub
        </a>
      </div>
    </div>
  </footer>
</template>