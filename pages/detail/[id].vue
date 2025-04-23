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

const word = computed(() => {
  for (const group of store.items) {
    const found = group.words.find(word => word.id === route.params.id)
    if (found)
      return found
  }
  return null
})

function handleTakePhoto() {
  router.push('/camera')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <StatusBar />
    <div class="p-4">
      <BackButton />
      <h1 class="text-xl mb-4">
        {{ date }}
      </h1>
      <div class="space-y-4">
        <img
          :src="word?.imageUrl"
          :alt="word?.word"
          class="w-full object-contain rounded-lg"
          style="max-height: calc(100vh - 300px);"
        >
      </div>
    </div>
    <RecognitionBox
      :date="date"
      :instruction="word?.word || ''"
      :on-take-photo="handleTakePhoto"
    />
  </div>
</template>
