<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <button class="p-2" @click="router.back()">
    <span class="text-xl">&lt;</span>
  </button>
</template>
