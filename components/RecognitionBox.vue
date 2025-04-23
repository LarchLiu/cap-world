<script setup lang="ts">
defineProps({
  date: {
    type: String,
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
      <div class="flex flex-row items-center space-x-2">
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
      <CameraButton @take-photo="onTakePhoto" />
    </div>
  </div>
</template>
