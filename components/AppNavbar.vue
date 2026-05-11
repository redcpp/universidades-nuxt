<template>
  <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"/>
            </svg>
          </div>
          <span class="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Universidades México
          </span>
        </NuxtLink>
        <div class="flex items-center gap-1">
          <NuxtLink 
            to="/" 
            exact-active-class="text-blue-600 bg-blue-50"
            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            Inicio
          </NuxtLink>
          <NuxtLink 
            to="/buscador" 
            active-class="text-blue-600 bg-blue-50"
            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            Buscador
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>