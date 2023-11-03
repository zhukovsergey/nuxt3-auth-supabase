// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['nuxt-icon','@nuxtjs/supabase', [
    '@pinia/nuxt',
    {
      autoImports: ['defineStore',  'definePiniaStore'],
    },
  ]],
  
  css: ['@/assets/css/main.css'],
  supabase: {
    redirect : false
  },
  imports: {
    dirs: ['stores'],
  },
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
