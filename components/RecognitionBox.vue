<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  onTakePhoto: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div class="recognition-box">
    <div class="flex items-center justify-center space-x-2 mb-4">
      <CameraButton :is-loading="isLoading" @take-photo="onTakePhoto" />
    </div>
  </div>
</template>
