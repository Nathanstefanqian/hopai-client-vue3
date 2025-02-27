<template>
  <div class="spu w-100vw">
    <up-swiper class="spu-swiper" :list="list1" indicator circular height="900rpx" @change="(e: any)=> current = e.current">
      <template #indicator>
        <div class="indicator">
          <view
            class="indicator__dot"
            v-for="(item, index) in list1"
            :key="index"
            :class="[index === current && 'indicator__dot--active']"
          >
          </view>
        </div>
      </template>
    </up-swiper>
    <div class="spu-layout">
      <div class="spu-main">
        <div class="card">
          <div class="red-ball"></div>
          <div class="yellow-ball"></div>
          <div class="card-top">
            <div class="tag">风格写真</div>
            <div class="desc">
                <div class="title">日式写真jk超美氛围感,日式写真jk超美氛围感,日式写真jk超美氛围感</div>
                <div class="price">
                  ￥
                  <span class="price-num">99元</span>
                  起
                </div>
            </div>
          </div>
          <div class="card-divider"></div>
          <div class="card-bottom">
            <div class="card-bottom-item" v-for="(item,index) in card" :key="index">
              <div class="card-bottom-item-one">
                <image :src="netConfig.picURL + '/static/home/' + item.url" class="icon" />
              </div>
              <div class="card-bottom-item-two">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <div class="spu-desc">
          <div class="spu-desc-header">
            <div class="spu-desc-header-item">
              <span>产品详情</span>
              <div class="red"></div>
            </div>
            <div class="spu-desc-header-item">
              <span>服务说明</span>
            </div>
          </div>
          123
        </div>
      </div>
    </div>
    <div class="spu-footer">
      <div class="spu-footer-item">
        <image :src="netConfig.picURL + '/static/home/chat.svg'" class="consult" />
        <span>详细问问</span>
      </div>
      <div class="spu-footer-btn" @click="handleAppointment">立即预约</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
const list1: string[] = [
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/1.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/2.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/3.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/4.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/5.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/6.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/7.jpg',
  'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/8.jpg'
]
const current = ref()
const card = ref([
  { title: '2小时拍摄', url: 'time.svg' },
  { title: '12张精修', url: 'refine.svg' },
  { title: '300+底图', url: 'photo.svg' },
  { title: '3天内交付', url: 'deliver.svg' }
])
const handleAppointment = () => {
  uni.navigateTo({
    url:'/packageHome/appointment/index'
  })
}
</script>

<style lang="scss" scoped>
.spu {
  min-height: 100vh;
  background-color: #f6f6f6;
  &-swiper {
    z-index: 2;
  }
  .indicator {
    @include flex(row);
    justify-content: center;
    margin-bottom: 80rpx;
    &__dot {
          height: 6px;
          width: 6px;
          border-radius: 100px;
          background-color: rgba(255, 255, 255, 0.35);
          margin: 0 5px;
          transition: background-color 0.3s;

        &--active {
              background-color: #ffffff;
          }
    }
  }

  .spu-layout {
    position: relative;
    .spu-main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -70rpx;
      width: 100vw;
      .card {
        display: flex;
        flex-direction: column;
        width: 95%;
        background-color: #fff;
        border-radius: 16rpx;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        margin-bottom: 32rpx;

        .red-ball {
          position: absolute;
          width: 270rpx;
          height: 270rpx;
          border-radius: 50%;
          background-color: #f8d3d3;
          right:180rpx;
          top: -200rpx;
          filter: drop-shadow(0px 8px 22px rgba(248, 211, 211, 0.40))
        }
        .yellow-ball {
          position: absolute;
          width: 270rpx;
          height: 270rpx;
          border-radius: 50%;
          background-color: #FDF1D4;
          filter: drop-shadow(0px 8px 22px rgba(244, 232, 201, 0.60));
          right:10rpx;
          top: -180rpx;
        }

        &-top {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 32rpx;
          box-sizing: border-box;
          background: linear-gradient(180deg, rgba(248, 211, 211, 0.40) 0.26%, rgba(248, 211, 211, 0.00) 30.47%), #FFF;
          .tag {
            padding: 12rpx 16rpx;
            background-color: rgba(249, 233, 132, 0.90);
            border-radius: 8rpx;
            height: 32rpx;
            width: 108rpx;
            font-size: 28rpx;
            margin-bottom: 16rpx;
          }
          .desc {
            display: flex;
            justify-content: space-between;

            .title {
              max-width: 400rpx;
              font-size: 36rpx;
            }
            .price {
              color: #ba2636;
              font-weight: 400;
              margin-right: 12rpx;
              &-num {
              font-weight: 700;
                font-size: 68rpx;
              }
            }
          }
        }

        &-divider {
          background: rgba(0, 0, 0, 0.12);
          width: calc(100% - 64rpx);
          height: 2rpx;
          margin: 0 auto;
        }

        &-bottom {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
          padding: 32rpx;

          &-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 25%;
            box-sizing: border-box;
            padding: 32rpx 30rpx;
            &-one {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100rpx;
              height: 100rpx;
              border-radius: 50%;
              background-color: rgba(0, 0, 0, 0.04);

              .icon {
                width: 56rpx;
                height: 56rpx;
              }
            }
            &-two {
              color: rgba(0, 0, 0, 0.7);
              margin-top: 10rpx;
              font-size: 24rpx;
            }
          }
        }

      }
      .spu-desc {
        width: 100vw;
        height: 1000rpx;
        background-color: #fff;

        &-header {
          display: flex;
          justify-content: center;
          padding: 32rpx;
          &-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 32rpx;
            .red {
              width: 80%;
              background-color: #ba2636;
              height: 4rpx;
              margin-top: 10rpx;
            }
          }
          
        }
      }
    }
  }
  &-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    box-sizing: border-box;
    background-color: #f6f6f6;
    padding: 32rpx 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: rgba(0, 0, 0, 0.7);
      font-size: 26rpx;
      .consult {
        width: 60rpx;
        height: 60rpx;
      }

    }
    &-btn {
      padding: 16rpx 24rpx;
      background-color: #000;
      border-radius: 16rpx;
      color: #fff;
    }
  }
}
</style>