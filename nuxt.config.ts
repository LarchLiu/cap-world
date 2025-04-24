// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    ttsApiKey: '', // used for server https://edgetts.deno.dev
    recognizeBaseUrl: '', // used for server, tencent cloud
    openaiApiKey: '', // used for OpenAI API
    removeBgApiKey: '', // used for remove.bg API
    falApiKey: '', // used for fal.ai API
    falModelId: 'fal-ai/birefnet/v2:webp', // used for fal.ai model ID
    silliconApiKey: '', // used for silliconflow.cn
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
