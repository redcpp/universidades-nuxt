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
      <div class="border-t border-slate-800 mt-12 pt-8 text-center text-xs">
        <p>Migrado a Nuxt 3 + Tailwind CSS en 2026</p>
      </div>
    </div>
  </footer>
</template>