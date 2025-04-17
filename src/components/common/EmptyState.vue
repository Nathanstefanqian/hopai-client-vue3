<template>
  <div class="empty-state">
    <image :src="netConfig.picURL + '/static/empty.svg'" class="empty-icon" />
    <div class="empty-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config'

defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  icon: {
    type: String,
    required: true
  },
  paddingTop: {
    type: String,
    default: '40rpx'
  }
})
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 40rpx 40rpx;
  padding-top: v-bind(paddingTop);
  
  .empty-icon {
    width: 600rpx;
    height: 600rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: rgba(40, 40, 40, 0.5);
  }
}
</style>