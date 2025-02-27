<template>
  <div class="appointmentConfirm">
    <div class="card1">
      <div class="card1-header">
        产品信息
      </div>
      <div class="card1-main">
        <div class="left">
          <image src="https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/1.jpg" class="left-image" mode="aspectFill" />
          <div class="left-desc">
            <div class="title">校园写真</div>
            <div class="desc">2组/12精修、拍摄2小时</div>
            <div class="tag">
              <span class="tag-btn">风格写真</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="price">￥ 399.00</div>
        </div>
      </div>
    </div>
    <div class="card2">
      <div class="card2-header">预约信息</div>
      <div class="card2-main">
         <div class="card2-main-item">
          <div class="left">联系人</div>
          <div class="right">李先生</div>
         </div>
         <div class="card2-main-item">
          <div class="left">手机号</div>
          <div class="right">18372769872</div>
         </div>
         <div class="card2-main-item">
          <div class="left">时间</div>
          <div class="right">2023.12.27 9:00 - 11:00</div>
         </div>
         <div class="card2-main-item">
          <div class="left">地点</div>
          <div class="right">江苏省常州市新北区婚姻登记处</div>
         </div>
         <div class="card2-main-item">
          <div class="left">摄影师</div>
          <div class="right">李先生  158****1271</div>
         </div>
         <div class="card2-main-item">
          <div class="left">备注</div>
          <div class="right">麻烦摄影师多用85镜头拍，后期修图效果要有电影感。</div>
         </div>
         
      </div>
    </div>
    <div class="footer">
      <div class="left">
        <span class="left-1">实付款</span>
        <span class="left-2">￥ </span>
        <span class="left-3">99</span>
        <div class="left-4">.00</div>
      </div>
      <div class="right" @click="handlePay">立即支付</div>
     </div>

  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
const handlePay = () => {
  uni.navigateTo({
    url: '/packageHome/appointment/success'
  })
}

</script>

<style lang="scss" scoped>
.appointmentConfirm {
  width: 100vw;
  height: 100vh;
  background-color: #f6f6f6;
  box-sizing: border-box;
  padding: 32rpx;

  .card1 {
    width: 100%;
    background-color: #fff;
    padding: 32rpx;
    box-sizing: border-box;
    border-radius: 12rpx;
    margin-bottom: 24rpx;
    &-header {
      font-weight: 400;
      margin-bottom: 25rpx;
    }
    &-main {
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;

        &-image {
          width: 180rpx;
          height: 100%;
          border-radius: 12rpx;
          margin-right: 20rpx;
        }

        &-desc {
          display: flex;
          flex-direction: column;
          width: 300rpx;
          flex-wrap: wrap;
          .title {
            margin-bottom: 20rpx;
          }
          .desc {
            font-size: 24rpx;
            color: rgba(40, 40, 40, 0.50);
            font-weight: 550;
            margin-bottom: 30rpx;
          }
          .tag {
            &-btn {
              display: inline-flex;
              padding: 8rpx 16rpx;
              border-radius: 12rpx;
              background-color: rgba(249, 233, 132, 0.90);
            }
          }
        }

      }
    }
  }

  .card2 {
    width: 100%;
    padding: 48rpx 32rpx;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 12rpx;

    &-header {
      margin-bottom: 24rpx;
      font-weight: 400;
    }

    &-main {
      display: flex;
      flex-direction: column;
      &-item {
        display: flex;
        font-size: 28rpx;
        margin-bottom: 16rpx;
        font-weight: 450;

        .left {
          min-width: 152rpx;
          box-sizing: border-box;
          padding-right: 24rpx;
        }

        .right {
          display: flex;
          flex-wrap: wrap;
          color: rgba(40, 40, 40, 0.50);
        }
      }
    }
  }

  .footer {
    width: 100vw;
    position: absolute;
    align-items: flex-end;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    padding: 32rpx 32rpx 64rpx 32rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      &-1 {
        font-size: 28rpx;
        color: rgba(40, 40, 40, 0.50);
        margin-right: 10rpx;
      }
      &-2 {
        font-size: 28rpx;
        color: #ba2636;
        font-weight: 600;
      }
      &-3 {
        font-size: 48rpx;
        font-weight: 600;
        color: #ba2636;
      }
      &-4 {
        font-size: 28rpx;
        color: #ba2636;
        font-weight: 600;
      }

    }

    .right {
      padding: 14rpx 24rpx;
      background-color: #282828;
      color: #fff;
      border-radius: 12rpx;
    }
  }

}
</style>