<template>
  <div class="sku">
    <div class="card" v-for="(item,index) in productList" :key="index">
      <div class="card-top">
        <image :src="item.picUrl" class="w-330rpx h-400rpx card-top-image" mode="aspectFill" />
        <div class="tag">{{ item.name }}</div>
      </div>
      <div class="card-bottom">
        <span class="title">{{ item.name }}</span>
        <span class="price">{{ item.priceInfo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategory, getCategoryTree } from '@/api/home';

const productList = ref<any[]>([]);

onLoad(async (options: any) => {
  if (options.categoryId) {
    try {
      const res = await getCategoryTree()
      if (res.data) {
        productList.value = res.data[options.categoryId].children
        console.log(productList.value)
      }
    } catch (error) {
      console.error('获取分类商品列表失败:', error);
    }
  }
});
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
      margin-bottom: 10rpx;
      position: relative;
      &-image {
        border-radius: 12rpx;
      }
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