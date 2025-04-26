// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    ttsApiKey: '', // used for server https://edgetts.deno.dev
    recognizeBaseUrl: '', // used for server, tencent cloud
    openaiApiKey: '', // used for OpenAI API
    removeBgApiKey: '', // used for remove.bg API
    falApiKey: '', // used for fal.ai API
    falModelId: 'fal-ai/birefnet/v2:webp', // used for fal.ai model ID
    silliconApiKey: '', // used for silliconflow.cn
    bailianApiKey: '', // used for aliyun bailian
  },
  compatibilityDate: '2025-04-26',
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      'autoprefixer': {},
    },
  },
  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },
})
