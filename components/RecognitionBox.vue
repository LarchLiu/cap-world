<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  onTakePhoto: {
    type: Function,
    required: true,
  },
})

async function handleTTS(item: string) {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words: item }),
    })

    if (!response.ok) {
      throw new Error('Failed to get speech')
    }

    // Handle audio response
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    await audio.play()
  }
  catch (error) {
    console.error('Error playing TTS:', error)
  }
}
</script>

<template>
  <div class="recognition-box">
    <div class="flex items-center justify-center space-x-2 mb-4">
      <div v-if="instruction" class="flex flex-row items-center space-x-2">
        <div v-for="(item, index) in instruction.split(', ')" :key="index">
          <div class="text-sm text-gray-500">
            {{ item }}
          </div>
          <button
            v-if="item"
            class="p-2 text-gray-500 hover:text-gray-700"
            @click="handleTTS(item)"
          >
            🔊
          </button>
        </div>
      </div>
      <div v-if="isLoading" class="flex items-center">
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
      <CameraButton @take-photo="onTakePhoto" />
    </div>
  </div>
</template>
