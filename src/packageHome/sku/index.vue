<template>
  <div class="sku">
    <div class="card" v-for="(item,index) in list2" :key="index">
      <div class="card-top">
        <image :src="item" class="w-330rpx h-400rpx card-top-image" mode="aspectFill" />
        <div class="tag">风格写真</div>
      </div>
      <div class="card-bottom">
        <span class="title">提供服装赠送精修</span>
        <span class="price">399元起</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const list2 = [
  'https://upload.codegod.site/test2/1.jpg',
  'https://upload.codegod.site/test2/2.jpg',
  'https://upload.codegod.site/test2/3.jpg',
  'https://upload.codegod.site/test2/4.jpg',
  'https://upload.codegod.site/test2/5.jpg',
  'https://upload.codegod.site/test2/6.jpg',
  'https://upload.codegod.site/test2/7.jpg',
  'https://upload.codegod.site/test2/8.jpg'
];
</script>

<style lang="scss" scoped>
.sku {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100vw;
  min-height: 100vh;
  background-color: #f6f6f6;
  box-sizing: border-box;
  padding: 32rpx;

  .card {
    width: 330rpx;
    margin-bottom: 52rpx;
    &-top {
      position: relative;
      &-image {
        border-radius: 12rpx;
      }
      margin-bottom: 10rpx;
      .tag {
        position: absolute;
        z-index: 2;
        top: 10rpx;
        padding: 8rpx;
        font-size: 24rpx;
        background-color:rgba(249, 233, 132, 0.90);
        border-radius: 8rpx;
      }
    }
    &-bottom {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 28rpx;
        margin-bottom: 10rpx;
      }

      .price {
        color: #ba2636;
        font-size: 26rpx;
      }
    }

  }
}
</style>