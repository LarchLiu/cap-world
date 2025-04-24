<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useVocabularyStore } from '~/stores/vocabulary'

const vocabularyStore = useVocabularyStore()
const { items } = storeToRefs(vocabularyStore)

// 初始化 store
onMounted(async () => {
  await vocabularyStore.initializeStore()
})

// 监听数据变化并同步到 IndexedDB
watch(items, async () => {
  await vocabularyStore.syncToIndexedDB()
}, { deep: true })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
