<template>
  <div class="order w-100vw h-100vh flex">
    <scroll-view class="order-tab-scrollview" scroll-x="true">
      <div class="order-tab">
        <div class="tab" v-for="item,index in tabList" :key="index" @click="handleClick(index)">
          <span class="mb-[10rpx]" :style="active === index ? { color: '#ba2636' } : {}">{{ item.name }}</span>
          <div class="svg-icon" v-if="active === index"></div>
        </div>
      </div>
    </scroll-view>
    <scroll-view class="order-main-scrollview" scroll-y="true">
      <div class="order-main">
        <div class="order-main-layout">
          <div class="order-item" v-for="(item,index) in  [1,2,3,4]" :key=index>
          <div class="order-item-top">
            <div class="order-item-top-header">
              <div class="header-one">
                <span class="mr-16rpx">订单号:  1321121a71982122</span>
                <image :src="netConfig.picURL + '/static/order/copy.svg'" class="w-40rpx h-40rpx"></image>
              </div>
              <div class="header-two">已完成</div>
            </div>
            <div class="order-item-top-divider"></div>
            <div class="order-item-top-body">
              <div class="title">
                <span class="title-name">萝莉写真三件套超级福利机</span>
                <span>￥ 399.00</span>
              </div>
              <div class="detail">
                <span class="text-[#ba2636]">2</span> 组 / <span class="text-[#ba2636]">12</span> 精修、
                拍摄 <span class="text-[#ba2636]">2</span> 小时
              </div>
              <div class="tag">活动会议</div>
            </div>
          </div>
          <div class="order-item-desc">
            <div class="order-item-desc-one">
              <div class="order-item-desc-one-item">
                <div class="title-item">时间</div>
                <div class="data-item">2023.12.27 9:00 - 11:00</div>
              </div>
              <div class="order-item-desc-one-item">
                <div class="title-item">地点</div>
                <div class="data-item">江苏省南通市如东县明霞花苑</div>
              </div>
              <div class="order-item-desc-one-item">
                <div class="title-item">摄影师</div>
                <div class="data-item">
                  <span class="mr-20rpx">钱先生</span>
                  <span class="mr-20rpx">180****8611</span>
                  <span class="mr-20rpx contakt">联系摄影师</span>
                </div>
              </div>
              <div class="order-item-desc-one-item">
                <div class="title-item">备注</div>
                <div class="data-item">
                  <span>麻烦拍出超绝可爱无敌福利萝莉写真电影感</span>
                </div>
              </div>
            </div>
            <div class="order-item-desc-two">
              <span class="mr-40rpx">实付款</span>
              <span>￥ 199.00</span>
            </div>
            <div class="order-item-desc-three">
              <div class="more">更多操作</div>
              <div class="right">
                <div class="comment">立即评价</div>
                <div class="download">下载照片</div>
              </div>
            </div>  
          </div>
        </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
const active = ref(0)
const handleClick = (index: number) => {
  active.value = index;
}
const tabList = ref([
  { name: '全部', path: '/' },
  { name: '待拍摄', path: '/discover' },
  { name: '已拍摄', path: '/discover' },
  { name: '已完成', path: '/my' },
  { name: '已关闭', path: '/my' },
  { name: '退款中', path: '/my' }
])
</script>

<style lang="scss" scoped>
.order-tab-scrollview {
  width: 100%;
  white-space: nowrap;
}
.order {
  display: flex;
  flex-direction: column;

  .order-tab {
    display: flex;
    flex-direction: row;
    padding: 24rpx 40rpx;
    .tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 22rpx 16rpx;
      margin-right: 24rpx;

      .svg-icon {
      height: 4rpx;
      width: 50rpx;
      background-color: #ba2636;
      }
    }
  }

  .order-main-scrollview {
    height: calc(100vh - 140rpx);
    background-color: #f6f6f6;
  }
  .order-main {
    &-layout {
      display: flex;
      padding: 32rpx;
      box-sizing: border-box;
      flex-wrap: wrap;
      width: 100%;
      flex-grow: 1;
      justify-content: space-between;
      .order-item {
      width: 100%;
      margin-bottom: 32rpx;
      padding-bottom: 48rpx;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;

      &-top {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        background-color: #fff;
        padding: 32rpx;
        border-radius: 16rpx 16rpx 0 0;

        &-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 40rpx;
          padding-bottom: 28rpx;
          .header-one {
            display: flex;
            align-items: center;  
          }
        }

        &-divider {
          width: 100%;
          height: 2rpx;
          background-color: #e5e5e5;
        }

        &-body {
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

      }

      &-desc {
        display: flex;
        width: 100%;
        flex-direction: column;
        background-color: #FAFAFA;
        box-sizing: border-box;
        padding: 32rpx;
        border-radius: 0 0 16rpx 16rpx;
        &-one {
          display: flex;
          flex-direction: column;
          margin-bottom: 48rpx;
          font-size: 26rpx;
          &-item {
            display: flex;
            flex-direction: row;
            margin-bottom: 8rpx;
            width: 100%;
            box-sizing: border-box;
            .title-item {
              min-width: 100rpx;
              margin-right: 40rpx;
            }
            .data-item {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              color: rgba(40, 40, 40, 0.80);
              .contakt {
                color: #456DD8;
                font-weight: 400;
                font-size: 24rpx;
              }
            }
          }
        }

        &-two {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24rpx;
        }

        &-three {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .more {
            font-size: 28rpx;
            color: rgba(40, 40, 40, 0.70);
            font-weight: 400;
          }
          .right {
            display: flex;
            font-size: 24rpx;
            .comment {
              margin-right: 20rpx;
              border: 0.33px solid rgba(40, 40, 40, 0.50);
              border-radius: 16rpx;
              padding: 12rpx 24rpx;
            }

            .download {
              color: #ba2636;
              border: 0.33px solid #ba2636;
              border-radius: 16rpx;
              padding: 12rpx 24rpx;
            }
          }
        }

      }
      }
    }
  }
}
</style>