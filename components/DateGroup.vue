<script setup lang="ts">
defineProps({
  date: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="mb-6">
    <h2 class="text-lg font-medium mb-4">
      {{ date }}
    </h2>
    <div class="space-y-4">
      <slot />
    </div>
  </div>
</template>
