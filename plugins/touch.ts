import type { Vue3TouchEventsOptions } from 'vue3-touch-events'
import Vue3TouchEvents from 'vue3-touch-events'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {})
})
