<script setup lang="ts">
import { useVocabularyStore } from '~/stores/vocabulary'

const route = useRoute()
const router = useRouter()
const store = useVocabularyStore()

const date = computed(() => {
  const group = store.items.find(group =>
    group.words.some(word => word.id === route.params.id),
  )
  return group?.date || ''
})

const group = computed(() => {
  for (const group of store.items) {
    const found = group.words.find(word => word.id === route.params.id)
    if (found)
      return found
  }
  return null
})

watch(group, (newGroup) => {
  if (!newGroup)
    return router.push('/')
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

// Find adjacent words for navigation
const adjacentWords = computed(() => {
  let prevWord: { id: string } | null = null
  let nextWord: { id: string } | null = null
  let foundCurrent = false

  for (const group of store.items) {
    for (let i = 0; i < group.words.length; i++) {
      if (foundCurrent) {
        nextWord = group.words[i]
        break
      }

      if (group.words[i].id === route.params.id) {
        foundCurrent = true
        if (i > 0) {
          prevWord = group.words[i - 1]
        }
        else if (store.items.indexOf(group) > 0) {
          const prevGroup = store.items[store.items.indexOf(group) - 1]
          prevWord = prevGroup.words[prevGroup.words.length - 1]
        }
      }
      else if (!foundCurrent) {
        prevWord = group.words[i]
      }
    }
    if (foundCurrent && nextWord)
      break
  }

  return {
    prev: prevWord?.id,
    next: nextWord?.id,
  }
})

function handleSwipe(direction: string) {
  if (direction === 'left' && adjacentWords.value.next) {
    router.push(`/detail/${adjacentWords.value.next}`)
  }
  else if (direction === 'right' && adjacentWords.value.prev) {
    router.push(`/detail/${adjacentWords.value.prev}`)
  }
}
</script>

<template>
  <div
    v-touch:swipe.left="() => handleSwipe('left')"
    v-touch:swipe.right="() => handleSwipe('right')"
    class="min-h-screen bg-gray-50"
  >
    <div class="p-4">
      <BackButton />
      <h1 class="text-xl mb-4">
        {{ date }}
      </h1>
      <div class="space-y-4">
        <img
          :src="group?.imageUrl"
          :alt="group?.word"
          class="w-full object-contain rounded-lg"
          style="max-height: calc(50vh);"
        >
      </div>
      <div v-if="group" class="flex flex-col items-center justify-center mt-2">
        <div v-for="(item, index) in group.data" :key="index" class="flex justify-center items-center space-x-2 mt-2">
          <div class="text-sm text-gray-500 text-xl">
            {{ `${item.chinese_name} ${item.english_name}` }}
          </div>
          <button
            v-if="item"
            class="p-2 text-gray-500 hover:text-gray-700"
            @click="handleTTS(item.english_name)"
          >
            🔊
          </button>
        </div>
      </div>
    </div>
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2">
      <NuxtLink to="/camera" class="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
        <div class="w-12 h-12 rounded-full border-4 border-gray-400" />
      </NuxtLink>
    </div>
  </div>
</template>
