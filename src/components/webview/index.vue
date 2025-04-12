<template>
  <web-view :src="url"></web-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const url = ref('')

onLoad((item: any) => {
  url.value = decodeURIComponent(item.url)
})
</script>

<style scoped>
</style>