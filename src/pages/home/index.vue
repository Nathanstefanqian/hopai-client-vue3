<template>
  <div class="h-648rpx w-100vw relative">
    <div class="home">
      <div class="home-location">
        <span class="mr-10rpx">南通</span>
        <image :src="netConfig.picURL + '/static/home/location.svg'" class="w-20rpx h-20rpx" />
      </div>
      <up-swiper :list="list1" indicatorMode="dot" indicator circular height="900rpx"></up-swiper>
      <div class="home-main">
        <div class="home-main-item">
          <div class="home-main-item-header">
            <div class="left">随心拍</div>
            <div class="right"  @click="handleSku">全部</div>
          </div>
          <scroll-view class="home-main-item-scrollview" scroll-x="true">
            <div class="home-main-item-body">
              <div class="card" v-for="(item,index) in list2" :key="index" @click="handleSpu">
                <div class="card-top">
                  <image :src="item" class="w-280rpx h-400rpx card-top-image" mode="aspectFill" /> 
                  <div class="tag">风格写真</div>
                </div>
                <div class="card-bottom">
                  <span class="title">提供服装赠送精修</span>
                  <span class="price">399元起</span>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
        <div class="home-main-item">
          <div class="home-main-item-header">
            <div class="left">随心拍</div>
            <div class="right">全部</div>
          </div>
          <scroll-view class="home-main-item-scrollview" scroll-x="true">
            <div class="home-main-item-body">
              <div class="card" v-for="(item,index) in list1" :key="index">
                <div class="card-top">
                  <image :src="item" class="w-280rpx h-400rpx card-top-image" mode="aspectFill" /> 
                </div>
                <div class="card-bottom">
                  <span class="title">提供服装赠送精修</span>
                  <span class="price">399元起</span>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';

const handleSpu = () => {
  uni.navigateTo({
    url: '/packageHome/spu/index'
  })
}

const handleSku = () => {
  uni.navigateTo({
    url: '/packageHome/sku/index'
  })
}
const test = () => {
  uni.navigateTo({
    url: '/packageHome/test/index'
  })
}

const list1: string[] = [
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/1.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/2.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/3.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/4.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/5.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/6.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/7.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/8.jpg'
];

const list2 = [
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/1.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/2.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/3.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/4.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/5.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/6.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/7.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test2/8.jpg'
];
</script>

<style lang="scss" scoped>
.home {
  position: relative;

  &-location {
    position: absolute;
    z-index: 1;
    top: 100rpx;
    left: 14rpx;
    height: 40rpx;
    font-weight: 500;
    border-radius: 16rpx;
    font-size: 32rpx;
    padding: 32rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-main {
    display: flex;
    padding: 32rpx;
    width: 100vw;
    box-sizing: border-box;
    min-height: 100vh;
    background-color: #f6f6f6;
    flex-direction: column;

    &-item {
      margin-top: 40rpx;
      width: 100%;
      margin-bottom: 60rpx;

      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        .left {
          font-weight: 400;
        }
        .right {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20rpx;
          color: #ba2636;
          border: 2rpx solid #ba2636;
          padding: 4rpx 16rpx;
          border-radius: 12rpx;
        }
      }

      .home-main-item-scrollview {
        width: 100%;
        white-space: nowrap;
      }

      &-body {
        display: flex;
        width: 100%;
        .card {
          min-width: 280rpx;
          margin-right: 40rpx;
          &-top {
            position: relative;
            margin-bottom: 10rpx;
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
    }
  }
}
</style>