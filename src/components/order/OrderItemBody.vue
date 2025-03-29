<template>
  <div class="order-item-top-body" v-if="data">
    <div class="title">
      <span class="title-name">{{ data.spuDescribe }}</span>
      <span>￥ {{ data.orderAmt / 100 }}</span>
    </div>
    <div class="detail">
      <span class="text-[#ba2636]">{{ data.photoNum }}</span> 组精修、
      拍摄 <span class="text-[#ba2636]">{{ Math.ceil((data.appointmentEndTime - data.appointmentStartTime) / (1000 * 60 * 60)) }}</span> 小时
    </div>
    <div class="tag">{{ data.spuDescribe }}</div>
  </div>
</template>

<script setup lang="ts">
interface OrderItemData {
  spuDescribe: string
  orderAmt: number
  photoNum: number
  appointmentStartTime: number
  appointmentEndTime: number
}

defineProps<{
  data: OrderItemData
}>()
</script>

<style lang="scss" scoped>
.order-item-top-body {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 28rpx 0;
  justify-content: space-between;

  .title {
    display: flex;
    justify-content: space-between;
    font-size: 32rpx;
    margin-bottom: 24rpx;
    &-name {
      font-weight: 400;
    }
  }

  .detail {
    font-size: 28rpx;
    margin-bottom: 24rpx;
    color: rgba(40, 40, 40, 0.70);
    font-weight: 400;
  }

  .tag {
    padding: 12rpx;
    width: 140rpx;
    border-radius: 16rpx;
    font-size: 26rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(249, 233, 132, 0.90);
  }
}
</style>