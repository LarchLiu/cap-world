<script setup lang="ts">
const time = ref('9:31')
</script>

<template>
  <div class="status-bar flex items-center justify-between px-4 bg-white">
    <div class="text-sm">
      {{ time }}
    </div>
    <div class="flex items-center space-x-1">
      <div>4G</div>
      <div class="h-3 w-6 bg-black rounded-sm" />
    </div>
  </div>
</template>
