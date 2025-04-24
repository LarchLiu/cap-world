<script setup lang="ts">
import { useVocabularyStore } from '~/stores/vocabulary'

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const previewImage = ref('')
const resultImage = ref('')
const router = useRouter()
const store = useVocabularyStore()
const isLoading = ref(false)

// Initialize camera on mount
onMounted(async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Use back camera if available
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    })
    videoRef.value!.srcObject = stream.value
  }
  catch (err) {
    console.error('Error accessing camera:', err)
  }
})

// Clean up on unmount
onUnmounted(() => {
  stopCamera()
})

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Take photo function
async function takePhoto() {
  if (!videoRef.value || !canvasRef.value)
    return

  const video = videoRef.value
  const canvas = canvasRef.value

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // Draw current video frame to canvas
  const context = canvas.getContext('2d')
  context && context.drawImage(video, 0, 0, canvas.width, canvas.height)

  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95))

    // Set preview image and stop camera
    previewImage.value = URL.createObjectURL(blob as Blob)
    stopCamera()
    isLoading.value = true

    const imgUrl = await blobToBase64(blob as Blob)
    // Send to backend
    const response = await fetch('/api/remove-bg', {
      method: 'POST',
      body: JSON.stringify({
        imageUrl: imgUrl,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const res = await response.json()
    resultImage.value = res.image.url

    // Call recognize API
    const recognizeResponse = await fetch('/api/recognize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: resultImage.value,
            },
          },
        ],
      }),
    })

    if (!recognizeResponse.ok) {
      throw new Error('Failed to recognize image')
    }

    const recognitionResult = await recognizeResponse.json()
    // console.log(recognitionResult)
    let recognition
    let recData
    if (recognitionResult.choices) {
      const content = recognitionResult.choices[0].message.content.replace('```json', '').replace('```', '')
      if (content) {
        recData = JSON.parse(content)
        if (recData && recData.length) {
          recognition = recData.map((item: any) => item.english_name).join(', ')
        }
      }
    }

    // Add the new word to the store
    const newId = (Date.now()).toString()
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate().toString().padStart(2, '0')}`

    // Find or create today's group
    let todayGroup = store.items.find(group => group.date === dateStr)
    if (!todayGroup) {
      todayGroup = {
        date: dateStr,
        words: [],
      }
      store.items.unshift(todayGroup)
    }

    // Add the new word
    todayGroup.words.unshift({
      id: newId,
      word: recognition || 'New Item',
      imageUrl: resultImage.value,
      data: recData || [],
    })
    isLoading.value = false

    // Navigate to detail page after a short delay to allow the image to be displayed
    setTimeout(() => {
      router.push(`/detail/${newId}`)
    }, 500)
  }
  catch (error) {
    console.error('Error uploading image:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Camera Preview -->
    <div class="relative">
      <video
        v-if="!previewImage"
        ref="videoRef"
        class="w-full h-[calc(100vh)] object-cover"
        autoplay
        playsinline
      />
      <canvas
        ref="canvasRef"
        class="hidden"
      />
      <img
        v-if="previewImage"
        :src="previewImage"
        class="w-full h-[calc(100vh)] object-cover"
      >
    </div>

    <RecognitionBox
      :is-loading="isLoading"
      :on-take-photo="takePhoto"
    />
  </div>
</template>
