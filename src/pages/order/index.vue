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
      <scroll-view 
        class="order-main-scrollview" 
        scroll-y="true"
        @scrolltolower="loadMore"
      >
      <div class="order-main">
        <div class="order-main-layout">
          <up-skeleton :loading="loading" rows="3">
            <EmptyState v-if="orderList.length === 0 && !loading" :icon="netConfig.picURL + '/static/empty.svg'" text="暂无订单" />
            <div class="order-item" v-for="(item,index) in orderList" :key="item.id" v-else>
              <div class="order-item-top">
                <div class="order-item-top-header">
                  <div class="header-one">
                    <span class="mr-16rpx">订单号: {{ item.id }}</span>
                    <image :src="netConfig.picURL + '/static/order/copy.svg'" class="w-40rpx h-40rpx" @click.stop="handleCopy(item.id)"></image>
                  </div>
                  <div class="header-two" style="color: #ba2636;">{{ orderStatusMap[item.orderStatus] }}</div>
                </div>
                <div class="order-item-top-divider"></div>
                <OrderItemBody v-if="item" :data="item" />
              </div>
              <div class="order-item-desc">
                <div class="order-item-desc-one">
                  <div class="order-item-desc-one-item">
                    <div class="title-item">创建时间</div>
                    <div class="data-item">{{ formatDate(item.createTime) }}</div>
                  </div>
                  <div class="order-item-desc-one-item">
                    <div class="title-item">时间</div>
                    <div class="data-item">{{ formatDate(item.appointmentStartTime) }} - {{ formatDate(item.appointmentEndTime) }}</div>
                  </div>
                  <div class="order-item-desc-one-item">
                    <div class="title-item">地点</div>
                    <div class="data-item">{{ item.location }}</div>
                  </div>
                  <div class="order-item-desc-one-item">
                    <div class="title-item">摄影师</div>
                    <div class="data-item">
                      <span class="mr-20rpx">{{ item.photographerName }}</span>
                      <span class="mr-20rpx">{{ item.photographerPhone }}</span>
                      <span class="mr-20rpx contakt" @click="handleCall(item.photographerPhone)">联系摄影师</span>
                    </div>
                  </div>
                  <div class="order-item-desc-one-item">
                    <div class="title-item">备注</div>
                    <div class="data-item">
                      <span>{{ item.remark }}</span>
                    </div>
                  </div>
                </div>
                <div class="order-item-desc-two">
                  <span class="mr-40rpx">实付款</span>
                  <span>￥ {{ item.actualAmt / 100 || item.orderAmt / 100 }}</span>
                </div>
                <div class="order-item-desc-three">
                  <div class="more" @click="handleMoreClick(item)">更多操作</div>
                  <div class="right">
                    <template v-if="handleOrderButton(item).show">
                      <div :class="handleOrderButton(item).class" @click.stop="handleOrderButton(item).onClick">{{ handleOrderButton(item).text }}</div>
                    </template>
                  </div>
                </div>  
              </div>
            </div>
            <up-loadmore :status="loadmoreStatus" />
          </up-skeleton>
        </div>
      </div>
      </scroll-view>
    <u-action-sheet
      :show="showActionSheet"
      :actions="actions"
      @close="showActionSheet = false"
      @select="handleActionSelect"
    />
    <up-popup :show="showQrCode" @close="showQrCode = false" mode="center" :round="10">
      <div class="qrcode-popup">
        <div class="qrcode-top">
          <div class="title">确认码</div>
          <div class="qrcode-wrapper">
            <canvas id="qrcode" canvas-id="qrcode" style="width: 400rpx; height: 400rpx"></canvas>
          </div>
          <div class="desc">出示此券码给摄影师确认订单</div>
        </div>
        <div class="qrcode-bottom">
          <OrderItemBody :data="currentOrder" />
        </div>
      </div>
    </up-popup>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import EmptyState from '@/components/common/EmptyState.vue';
import { getUserOrder, OrderVO, getQrCode, cancelOrder } from '@/api/order';
import OrderItemBody from '@/components/order/OrderItemBody.vue';

// @ts-ignore 引入二维码生成库
import UQRCode from 'uqrcodejs';
const handleCopy = (id: string) => {
  uni.setClipboardData({
    data: id,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000
      })
    }
  })
}

const handleCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  })
}

const active = ref(0)
const orderList: any = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const isLoadingMore = ref(false)

const loadmoreStatus = computed(() => {
  if (isLoadingMore.value) return 'loading'
  if (noMore.value) return 'nomore'
  return 'more'
})

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const orderStatusMap: Record<number, string> = {
  0: '待支付',
  1: '待确认',
  2: '待拍摄',
  3: '已拍摄',
  4: '待选图',
  5: '修图中',
  6: '待交付',
  7: '待评价',
  100: '已完成',
  10: '订单已取消',
  20: '退款中',
  30: '退款成功',
  11: '订单超时'
};

const tabList = ref([
  { name: '全部', path: '/', status: undefined },
  { name: '待支付', path: '/discover', status: [0] },
  { name: '待拍摄', path: '/discover', status: [1, 2] },
  { name: '待交付', path: '/discover', status: [3, 4, 5, 6] },
  { name: '已完成', path: '/my', status: [100] },
  { name: '退款', path: '/my', status: [20, 30] },
])

const handleClick = (index: number) => {
  active.value = index;
  currentPage.value = 1;
  noMore.value = false;
  orderList.value = [];
  const currentTab = tabList.value[index];
  const params: OrderVO = {
    pageNo: currentPage.value,
    pageSize: pageSize.value
  };
  
  if (currentTab.status !== undefined) {
    if (Array.isArray(currentTab.status)) {
      params.status = currentTab.status;
    } else {
      params.status = [currentTab.status];
    }
  }
  
  getOrderList(params);
}

const loadMore = async () => {
  if (loading.value || noMore.value || isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  currentPage.value += 1;
  
  const currentTab = tabList.value[active.value];
  const params: OrderVO = {
    pageNo: currentPage.value,
    pageSize: pageSize.value
  };

  if (currentTab.status !== undefined) {
    if (Array.isArray(currentTab.status)) {
      params.status = currentTab.status;
    } else {
      params.status = [currentTab.status];
    }
  }

  try {
    const res = await getUserOrder(params);
    const newList = res.data.list || [];
    if (newList.length < pageSize.value) {
      noMore.value = true;
    }
    orderList.value = [...orderList.value, ...newList];
  } catch (error) {
    console.error('加载更多订单失败:', error);
  } finally {
    isLoadingMore.value = false;
  }
}

const getOrderList = async (params: OrderVO) => {
  try {
    loading.value = true;
    const res = await getUserOrder(params);
    if (!res || !res.data) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    const list = res.data.list || [];
    if (list.length < pageSize.value) {
      noMore.value = true;
    }
    orderList.value = list;
  } catch (error) {
    uni.showToast({
      title: '获取订单列表失败',
      icon: 'none',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getOrderList({ pageNo: 1, pageSize: 10 });
})

onPullDownRefresh(async () => {
  currentPage.value = 1;
  noMore.value = false;
  orderList.value = [];
  const currentTab = tabList.value[active.value];
  const params: any = {
    pageNo: 1,
    pageSize: 10
  };
  if (currentTab.status !== undefined) {
    if (Array.isArray(currentTab.status)) {
      params.status = currentTab.status;
    } else {
      params.status = [currentTab.status];
    }
  }
  await getOrderList(params);
  uni.stopPullDownRefresh();
})
const showActionSheet = ref(false)
const currentOrder = ref<any>(null)

const actions = computed(() => {
  const orderStatus = currentOrder.value?.orderStatus
  const actionItems = []
  
  // 只在待支付状态显示取消订单，或在其他允许退款的状态下显示申请退款
  if (orderStatus === 0 || orderStatus === 11) {
    actionItems.push({ name: '取消订单', color: '#ba2636' })
  } else if (![100, 10, 20, 30].includes(orderStatus)) {
    actionItems.push({ name: '申请退款', color: '#ba2636' })
  }
  
  actionItems.push({ name: '开具发票' })
  return actionItems
})

const handleSelectPhoto = (item: any) => {
  uni.navigateTo({
    url: `/packageAlbum/choosePhoto/index?orderId=${item.id}`
  })
}

const handleMoreClick = async (item: any) => {
  currentOrder.value = item
  showActionSheet.value = true
}

const handleActionSelect = (item: any) => {
  showActionSheet.value = false
  if (item.name === '申请退款') {
    uni.navigateTo({
      url: `/packageOrder/refund/index?orderId=${currentOrder.value.id}`
    })
  } else if (item.name === '开具发票') {
    // TODO: 实现开票逻辑
    console.log('开具发票', currentOrder.value)
  } else if (item.name === '取消订单') {
    uni.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          let data: any = null
          try {
            data = await cancelOrder({
              id: currentOrder.value.id,
              cancellationReason: '用户主动取消'
            })
            console.log(data)
            if(data.data) {
              uni.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2000
            })
            }
            else {
              uni.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
              return
            }
            // 刷新订单列表
            getOrderList({ pageNo: currentPage.value, pageSize: pageSize.value })
          } catch (error) {
            uni.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      }
    })
  }
}

const handleTrungPhoto = (item: any) => {
  uni.navigateTo({
    url: `/packageAlbum/confirmPhoto/index?orderId=${item.id}`
  })
}
const showQrCode = ref(false)
const qrCodeData = ref('')

const handleOrderButton = (item: any) => {
  const buttonConfig = {
    show: true,
    text: '',
    class: '',
    onClick: () => {}
  }

  switch (item.orderStatus) {
    case 0:
      buttonConfig.text = '去支付'
      buttonConfig.class = 'download'
      buttonConfig.onClick = () => uni.navigateTo({ url: `/packageOrder/payment/index?orderId=${item.id}` })
      break
    case 7:
      buttonConfig.text = '立即评价'
      buttonConfig.class = 'comment'
      buttonConfig.onClick = () => uni.navigateTo({ url: `/packageOrder/review/index?orderId=${item.id}` })
      break
    case 3:
      buttonConfig.text = '等待摄影师上传原图'
      buttonConfig.class = 'download disabled'
      break
    case 2:
      buttonConfig.text = '使用劵码'
      buttonConfig.class = 'download'
      buttonConfig.onClick = () => handleQrCode(item)
      break
    case 4:
      buttonConfig.text = '去选图'
      buttonConfig.class = 'download'
      buttonConfig.onClick = () => handleSelectPhoto(item)
      break
    case 6:
      buttonConfig.text = '查看精修图'
      buttonConfig.class = 'download'
      buttonConfig.onClick = () => handleTrungPhoto(item)
      break
    default:
      buttonConfig.text = '无操作'
      buttonConfig.class = 'download disabled'
      break
  }

  return buttonConfig
}

const handleQrCode = async (item: any) => {
  try {
    const res = await getQrCode(item.id)
    // 使用uQRCode生成二维码
    const qr = new UQRCode()
    qr.data = res.data
    qr.size = 224
    qr.make()
    const canvasContext = uni.createCanvasContext('qrcode')
    qr.canvasContext = canvasContext
    qr.drawCanvas()
    currentOrder.value = item
    showQrCode.value = true
  } catch (error) {
    console.error('获取订单二维码失败:', error)
    uni.showToast({
      title: '获取二维码失败',
      icon: 'none',
      duration: 2000
    })
  }
}
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
                &.disabled {
                  color: rgba(40, 40, 40, 0.3);
                  border-color: rgba(40, 40, 40, 0.3);
                  pointer-events: none;
                }
              }
            }
          }
        }
      }
    }
    .no-more {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32rpx;
      color: rgba(40, 40, 40, 0.50);
      font-size: 24rpx;
      .line {
        width: 48rpx;
        height: 1px;
        background-color: rgba(40, 40, 40, 0.20);
        margin: 0 16rpx;
      }
    }
  }
}
.qrcode-popup {
  width: 90vw;
  .qrcode-top {
    width: 100%;
    height: 600rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32rpx;
    .title {
      font-size: 32rpx;
      font-weight: 500;
      margin-bottom: 32rpx;
    }
    .qrcode-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 400rpx;
      height: 400rpx;
      margin: 0 auto;
      margin-bottom: 24rpx;
    }
    .desc {
      font-size: 28rpx;
      color: rgba(40, 40, 40, 0.7);
    }
  }

  .qrcode-bottom {
      padding: 32rpx 40rpx;
      padding-bottom: 0;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 40rpx;
        right: 40rpx;
        top: 0;
        border-top: 2rpx dashed rgba(40, 40, 40, 0.1);
      }
      .title {
        font-size: 32rpx;
        font-weight: 500;
        margin-bottom: 16rpx;
      }
      .desc {
        font-size: 28rpx;
        color: rgba(40, 40, 40, 0.7);
        margin-bottom: 16rpx;
      }
      .tag {
        display: inline-block;
        padding: 4rpx 16rpx;
        background: rgba(186, 38, 54, 0.1);
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #BA2636;
        margin-bottom: 24rpx;
      }
      .price {
        font-size: 36rpx;
        font-weight: 500;
        color: #BA2636;
      }
  }
}


</style>