import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  modules: ['nuxt-seo-kit', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      defaultLocale: 'en'
    }
  },
  sitemap: {
    hostname: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    gzip: true,
    routes: async () => {
      // In a real project, fetch available routes from your CMS or schema service
      return ['/', '/about']
    }
  },
  seo: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    name: 'Renderer',
    description: 'Schema driven Nuxt 3 renderer'
  }
})
