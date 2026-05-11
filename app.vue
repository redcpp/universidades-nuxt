<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar />
    <NuxtLoadingIndicator color="#3b82f6" />
    <main class="flex-1 pt-16">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>