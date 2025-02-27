<template>
  <div class="detail">
    <div class="detail-item">
      <div class="detail-item-header">联系人</div>
      <div class="detail-item-input">姓名</div>
      <div class="detail-item-input">手机号</div>
    </div>
    <div class="detail-item">
      <div class="detail-item-header">拍摄地点</div>
      <div class="detail-item-input">省-市-区/县</div>
      <div class="detail-item-input">详细地址</div>
    </div>
    <div class="detail-item">
      <div class="detail-item-header">备注</div>
      <div class="detail-item-input h-300rpx">请输入100个字以内备注信息</div>
    </div>
    <div class="detail-footer">
      <div class="btn mr-20rpx">上一步</div>
      <div class="btn btn1" @click="handleNext">下一步</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handleNext = () => {
  uni.navigateTo({
    url: '/packageHome/appointment/photographer'
  })
}
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  
  &-item {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    margin-bottom: 48rpx;
    &-input {
      padding: 26rpx;
      font-size: 28rpx;
      color: rgba(40, 40, 40, 0.30);
      border: 1rpx solid rgba(0, 0, 0, 0.10);
      border-radius: 12rpx;
      margin-top: 24rpx;
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 32rpx 64rpx 64rpx 64rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 180rpx;
    width: 100vw;
    border-top: 1rpx solid rgba(40, 40, 40, 0.10);

    .btn {
      width: 300rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
      border: 1rpx solid #282828;
    }

    .btn1 {
      color: #fff;
      background-color: #282828;
    }
  }
}
</style>