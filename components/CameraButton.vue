<script setup lang="ts">
const emit = defineEmits(['takePhoto'])

function handleTakePhoto() {
  emit('takePhoto')
}
</script>

<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
    <button
      class="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center"
      @click="handleTakePhoto"
    >
      <div class="w-12 h-12 rounded-full border-4 border-rainbow" />
    </button>
    <button class="w-12 h-12 rounded-lg bg-white shadow-lg flex items-center justify-center">
      <div class="w-6 h-6 border-2 border-gray-400" />
    </button>
  </div>
</template>

<style scoped>
.border-rainbow {
  border-image: conic-gradient(from 0deg, violet, indigo, blue, green, yellow, orange, red) 1;
}
</style>
