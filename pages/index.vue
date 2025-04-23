<script setup lang="ts">
import { useVocabularyStore } from '~/stores/vocabulary'

const vocabulary = useVocabularyStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <StatusBar />
    <div class="p-4">
      <DateGroup v-for="group in vocabulary.items" :key="group.date" :date="group.date">
        <VocabularyItem
          v-for="item in group.words"
          :id="item.id"
          :key="item.id"
          :word="item.word"
          :image-url="item.imageUrl"
        />
      </DateGroup>
    </div>
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2">
      <NuxtLink to="/camera" class="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
        <div class="w-12 h-12 rounded-full border-4 border-rainbow" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.border-rainbow {
  border-image: conic-gradient(from 0deg, violet, indigo, blue, green, yellow, orange, red) 1;
}
</style>
