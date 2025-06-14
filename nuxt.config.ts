// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui-pro', '@nuxt/eslint', '@nuxthub/core'],
  $development: { hub: { remote: 'production' } },
  devtools: { enabled: true },
  app: { head: {
    title: 'Yamlyzer',
    htmlAttrs: { lang: 'en' },
  } },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-05-15',
  nitro: { experimental: { openAPI: true } },
  hub: {
    bindings: { compatibilityDate: '2025-05-05' },
    workers: true,
    database: true,
    ai: true,
  },
  eslint: {
    config: { stylistic: true },
    checker: true,
  },
})
