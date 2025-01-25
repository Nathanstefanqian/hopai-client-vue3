<template>
  <div class="h-648rpx mt-100rpx w-100vw relative">
    <button @click="test()">测试分包步入</button>
  </div>
</template>

<script setup lang="ts">
const test = () => {
  uni.navigateTo({
    url: '/packageHome/test/index'
  })
}
</script>

<style lang="scss" scoped>
.home {
  
}
</style>