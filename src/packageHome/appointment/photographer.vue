<template>
  <div class="photographer">
    <div class="photographer-header">
      <div class="left">选择摄影师</div>
      <div class="right">共 10 位摄影师</div>
    </div>
    <div class="photographer-tag">
      <div class="photographer-tag-item" :class="{ active: currentLevel === 'newbee' }" @click="handleLevel('newbee')">
        <image :src="netConfig.picURL + '/static/home/' + (currentLevel === 'newbee' ? 'hopai-newbee-active.svg' : 'hopai-newbee.svg')" class="tag" />
        <span>摄影新秀</span>
      </div>
      <div class="photographer-tag-item" :class="{ active: currentLevel === 'expert' }" @click="handleLevel('expert')">
        <image :src="netConfig.picURL + '/static/home/' + (currentLevel === 'expert' ? 'hopai-normal-active.svg' : 'hopai-normal.svg')" class="tag" />
        <span>摄影专家</span>
      </div>
      <div class="photographer-tag-item" :class="{ active: currentLevel === 'master' }" @click="handleLevel('master')">
        <image :src="netConfig.picURL + '/static/home/' + (currentLevel === 'master' ? 'hopai-master-active.svg' : 'hopai-master.svg')" class="tag" />
        <span>摄影大师</span>
      </div>
    </div>
    <div class="photographer-main">
      <scroll-view class="photographer-main-scroll-view" scroll-y="true">
        <div class="photographer-main-card" v-for="item,index in 5" :key="index">
          <div class="card">
            <div class="card-1">
              <div class="left">
                <image class="avatar" :src="netConfig.picURL + '/static/my/avatar.jpg'" />
                <div class="card-1-info">
                  <div class="name">钱卢骏</div>
                  <div class="score">
                    <up-rate :count="5" active-color="#F8C646" disabled></up-rate>
                    <span class="ml-10rpx score-text">4.5分</span>
                  </div>
                </div>
              </div>
              <div class="right">
                <up-checkbox usedAlone shape="circle" activeColor="#ba2636"/>
              </div>
            </div>
            <div class="card-2">
              <div>
                <span>拍摄设备：</span>
                <span>尼康a62/索尼a7m3</span>
              </div>
              <div>
                <span>拍摄镜头：</span>
                <span>85定焦/50定焦/35定焦</span>
              </div>
            </div>
            <div class="card-3">
              <div class="left">
                <span>约拍价</span>
                <span class="price">
                  <span style="font-size: 32rpx"> ￥ </span> 99.00</span>
              </div>
              <div class="right" @click="handleDetail">
                TA的主页
              </div>
            </div>
          </div>
        </div>
      </scroll-view>
    </div>
    <div class="photographer-footer">
      <div class="photographer-footer-btn mr-20rpx" @click="handlePre">上一步</div>
      <div class="photographer-footer-btn btn" @click="handleNext">下一步</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';

const currentLevel = ref('newbee')

const handleLevel = (level: string) => {
  currentLevel.value = level
}
const handlePre = () => {
  uni.navigateBack()
}

const handleNext = () => {
  uni.navigateTo({
    url: '/packageHome/appointment/confirm'
  })
}

const handleDetail = () => {
  uni.navigateTo({
    url: '/packageHome/appointment/photographerDetail'
  })
}
</script>

<style lang="scss" scoped>
.photographer-main-scroll-view {
  width: 100%;
  white-space: nowrap;
}
.photographer {
  width: 100vw;
  height: 100vh;

  &-header {
    display: flex;
    justify-content: space-between;
    padding: 32rpx;
    background-color: #fff;

    .left {
    }

    .right {
      font-size: 28rpx;
      color: rgba(40, 40, 40, 0.50);
    }
  }

  &-tag {
    display: flex;
    padding: 16rpx 32rpx 32rpx 32rpx;
    height: 80rpx;
    background-color: #fff;
    justify-content: space-between;

    &-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding: 0 16rpx;
      width: 200rpx;
      height: 80rpx;
      border-radius: 12rpx;
      border: 1rpx solid rgba(40, 40, 40, 0.50);
      font-size: 28rpx;
      transition: all 0.3s ease;
      cursor: pointer;

      &.active {
        border-color: #ba2636;
        color: #ba2636;
      }
    }

    .tag {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
      transition: filter 0.3s ease;
    }
  }

  &-main {
    display: flex;
    width: 100vw;
    box-sizing: border-box;
    height: 1070rpx;
    padding: 32rpx;
    padding-bottom: 0;
    background-color: #f6f6f6;

    &-card {
      display: flex;

      .card {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 12rpx;
        box-sizing: border-box;
        padding: 32rpx;
        background-color: #fff;
        margin-bottom: 40rpx;

        &-1 {
          display: flex;
          margin-bottom: 20rpx;
          justify-content: space-between;
          .left {
            display: flex;
            .avatar {
              border-radius: 50%;
              width: 90rpx;
              height: 90rpx;
              margin-right: 20rpx;
            }

            .card-1-info {
              display: flex;
              flex-direction: column;
              .name {
                font-size: 34rpx;
                font-weight: 400;
              }
              .score {
                display: flex;
                align-items: center;
                &-text {
                  font-size: 24rpx;
                }
              }
            }
          }

          .right {

          }

        }

        &-2 {
          display: flex;
          flex-direction: column;
          font-size: 28rpx;
          color: rgba(40,40,40,1);
          margin-bottom: 20rpx;
        }

        &-3 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 12rpx;
          .left {
            font-size: 28rpx;
            .price {
               font-size: 56rpx;
               color: #ba2636;
            }
          }
          .right {
            padding: 8rpx 32rpx;
            border-radius: 12rpx;
            font-size: 28rpx;
            border: 1rpx solid rgba(0,0,0,0.55);
          }
        }

      }
    }
  }

  &-footer {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    display: flex;
    padding: 32rpx 64rpx 64rpx 64rpx;
    background-color: #fff;
    &-btn {
      width: 300rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
      border: 1rpx solid #282828;
    }
    .btn {
      color: #fff;
      background-color: #282828;
    }
  }
  
}
</style>