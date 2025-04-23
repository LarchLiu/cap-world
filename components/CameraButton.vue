<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits(['takePhoto'])
const router = useRouter()

function handleTakePhoto() {
  emit('takePhoto')
}
</script>

<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
    <div v-if="isLoading" class="flex items-center">
      <div class="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
        <svg
          class="animate-spin h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12zm2.5-1h9a2.5 2.5 0 1 1-5 0h-4a2.5 2.5 0 0 1-4.5-1z"
          />
        </svg>
      </div>
    </div>
    <div v-else class="flex flex-row items-center space-x-4">
      <button class="w-12 h-12 rounded-lg bg-white shadow-lg flex items-center justify-center">
        <div @click="router.back()">
          <span class="text-xl">&lt;</span>
        </div>
      </button>
      <button
        class="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
        @click="handleTakePhoto"
      >
        <div class="w-12 h-12 rounded-full border-4 border-gray-400" />
      </button>
      <button class="w-12 h-12 rounded-lg bg-white shadow-lg flex items-center justify-center">
        <div class="w-6 h-6 border-2 border-gray-400" />
      </button>
    </div>
  </div>
</template>
