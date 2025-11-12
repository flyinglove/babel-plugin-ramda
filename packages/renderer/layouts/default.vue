<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="py-6 shadow bg-white">
      <div class="container mx-auto px-6">
        <h1 class="text-2xl font-semibold">Nuxt Schema Renderer</h1>
      </div>
    </header>
    <main class="container mx-auto px-6 py-10">
      <slot />
    </main>
  </div>
</template>

<style>
.container {
  max-width: 960px;
}
</style>
