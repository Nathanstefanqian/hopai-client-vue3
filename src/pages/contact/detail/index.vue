<template>
  <div class="detail">
    <image :src="imageUrl" mode="widthFix" class="detail-image"  />
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import { ref } from 'vue';

const imageUrl = ref('');

onLoad((options: any) => {
  const { typeId } = options;
  imageUrl.value = `${netConfig.picURL}/static/question/${typeId}.jpg`;
});
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #ba2636;

  &-image {
    width: 100vw;
  }
}
</style>