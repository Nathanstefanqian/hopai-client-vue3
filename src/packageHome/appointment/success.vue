<template>
  <div class="success">
    <image :src="netConfig.picURL + '/static/home/success.svg'" />
    <div class="success-title">
      <span class="success-title-1">支付成功</span>
      <span class="success-title-2">美好即将发生</span>
    </div>
    <div class="success-btn">
      查看订单
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';


</script>

<style lang="scss" scoped>
.success {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  &-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 400;
    margin-top: 64rpx;

    &-1 {
      font-size: 48rpx;
      margin-bottom: 24rpx;
    }

    &-2 {
      font-size: 28rpx;
    }
  }

  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 132rpx;
    font-size: 34rpx;
    width: 260rpx;
    box-sizing: border-box;
    padding: 18rpx 32rpx;
    border: 1rpx solid #000;
    border-radius: 12rpx;

  }
}
</style>