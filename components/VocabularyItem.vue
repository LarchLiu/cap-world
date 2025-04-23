<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
})

const router = useRouter()

function navigateToDetail() {
  router.push(`/detail/${props.id}`)
}
</script>

<template>
  <div class="vocabulary-item flex items-center space-x-4" @click="navigateToDetail">
    <img :src="imageUrl" :alt="word" class="w-16 h-16 object-cover rounded-lg">
    <div class="text-lg">
      {{ word }}
    </div>
  </div>
</template>
