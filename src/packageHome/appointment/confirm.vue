<template>
  <div class="appointmentConfirm">
    <div class="card1">
      <div class="card1-header">
        产品信息
      </div>
      <div class="card1-main">
        <div class="left">
          <image :src="orderData.spuInfo?.picUrl || ''" class="left-image" mode="aspectFill" />
          <div class="left-desc">
            <div class="title">{{ orderData.spuInfo?.introduction || '' }}</div>
            <div class="desc">{{ orderData.spuInfo?.rawCount || 0 }}张底片/{{ orderData.spuInfo?.retouchedImageCount || 0 }}张精修</div>
            <div class="desc">拍摄{{ orderData.spuInfo?.shootingTime || 0 }}小时/{{ orderData.spuInfo?.deliveryTime || 0 }}天交付</div>
            <div class="tag">
              <span class="tag-btn">{{ orderData.spuInfo?.name || '' }}</span>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="price">￥ {{ orderData.photographerInfo.price  || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="card2">
      <div class="card2-header">预约信息</div>
      <div class="card2-main">
         <div class="card2-main-item">
          <div class="left">联系人</div>
          <div class="right">{{ orderData.contactInfo.name }}</div>
         </div>
         <div class="card2-main-item">
          <div class="left">手机号</div>
          <div class="right">{{ orderData.contactInfo.phone }}</div>
         </div>
         <div class="card2-main-item">
          <div class="left">时间</div>
          <div class="right">{{ formatDateTime(orderData.appointmentStart) }} - {{ formatDateTime(orderData.appointmentEnd) }}</div>
         </div>
         <div class="card2-main-item">
          <div class="left">地点</div>
          <div class="right">{{ orderData.contactInfo.area }} {{ orderData.contactInfo.address }}</div>
         </div>
         <div class="card2-main-item">
          <div class="left">摄影师</div>
          <div class="right">{{ orderData.photographerInfo?.nickname }} {{ orderData.photographerInfo?.phone }}</div>
         </div>
         <div class="card2-main-item">
          <div class="left">备注</div>
          <div class="right">{{ orderData.contactInfo.remark || '暂无' }}</div>
         </div>
         
      </div>
    </div>
    <div class="footer">
      <div class="left">
        <span class="left-1">实付款</span>
        <span class="left-2">￥ </span>
        <span class="left-3">{{ orderData.photographerInfo.price || 0 }}</span>
      </div>
      <div class="right" @click="handlePay">立即支付</div>
     </div>

  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import { createUserOrders, submitPayOrders } from '@/api/order';
import pingpp from 'pingpp-js'
import { useUserStore } from '@/pinia/user';

const orderData = ref<any>({
  spuInfo: null,
  appointmentStart: '',
  appointmentEnd: '',
  contactInfo: {
    name: '',
    phone: '',
    area: '',
    address: '',
    areaCode: '',
    remark: ''
  },
  photographerId: '',
  photographerInfo: null,
  totalAmount: 0
});

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const loadOrderData = () => {
  // 从缓存中获取各个页面的数据
  const spuInfo = uni.getStorageSync('selectedSpu');
  const appointmentTime = uni.getStorageSync('appointmentTime');
  const contactInfo = uni.getStorageSync('contactInfo');
  const photographerInfo = uni.getStorageSync('selectedPhotographer');

  if (spuInfo) {
     orderData.value.spuInfo = spuInfo;
  }

  if (photographerInfo) {
    orderData.value.photographerId = photographerInfo.userId;
    orderData.value.photographerInfo = photographerInfo;
    orderData.value.totalAmount = parseFloat(photographerInfo.price) * 100 || 0;
  }

  if (appointmentTime) {
    // 保存时间戳用于提交订单
    orderData.value.appointmentStart = new Date(appointmentTime.start).getTime();
    orderData.value.appointmentEnd = new Date(appointmentTime.end).getTime();
  }

  if (contactInfo) {
    orderData.value.contactInfo = contactInfo;
  }

  if (photographerInfo) {
    orderData.value.photographerId = photographerInfo.userId;
    orderData.value.photographerInfo = photographerInfo;
  }
};

const userStore = useUserStore();
const handlePay = async () => {
  const userInfo = userStore.userInfo;
  if (!userInfo) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    });
    return;
  }
  try {
    // 这里添加创建订单的API调用
    // 预留一个字段，用来存储具体的定位信息
    const orderParams = {
      spuId: orderData.value.spuInfo?.id,
      photographerId: orderData.value.photographerId,
      appointmentStartTime: orderData.value.appointmentStart,
      appointmentEndTime: orderData.value.appointmentEnd,
      memberName: orderData.value.contactInfo.name,
      memberPhone: orderData.value.contactInfo.phone,
      location: orderData.value.contactInfo.address + orderData.value.contactInfo.area,
      orderAmt: orderData.value.totalAmount / 100,
      remark: orderData.value.contactInfo.remark
    };
    console.log('orderParams', orderParams);
    const data: any = await createUserOrders(orderParams)
    console.log('提交订单', data)
    if(!data.data) {
      uni.showToast({
        title: data.msg,
        icon: "none",
      });
      return
    }
    uni.showToast({
      title: '创建订单成功',
      icon: "success"
    })
    const payParams = {
      id: data.data,
      channelCode: 'yeepay_wx_lite_ofl',
      openId: userInfo.openid
    }
    setTimeout(async () => {
      const payData: any = await submitPayOrders(payParams)
      if(!payData.data) {
        uni.showToast({
            title: payData.msg,
            icon: "error",
          });
          return;
      }
      pingpp.createPayment(payData.data.charges.data[0], (result: any, err: any) => {
        if (result == "success") {
          uni.showToast({
                title: "支付成功",
                icon: "success",
          })
          // 支付成功后跳转到订单页面
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/order/index'
            })
          }, 1500)
        } else if (result === "fail") {
          uni.showToast({
            title: "支付失败",
            icon: "error",
          });
        } else if (result === "cancel") {
          uni.showToast({
            title: "支付取消",
            icon: "error",
          });
        }
    },2000)
    })
  } catch (error) {
    uni.showToast({
      title: '创建订单失败',
      icon: 'none'
    });
  }
};

onMounted(() => {
  loadOrderData();
});
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
          width: 160rpx;
          height: 200rpx;
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
            margin-bottom: 20rpx;
            color: rgba(40, 40, 40, 0.50);
          }
          .tag {
            &-btn {
              display: inline-flex;
              padding: 8rpx 16rpx;
              font-size: 24rpx;
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