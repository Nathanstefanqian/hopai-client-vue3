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
    <up-skeleton :loading="loading" rows="3">
      <scroll-view 
        class="order-main-scrollview" 
        scroll-y="true"
        @scrolltolower="loadMore"
      >
        <div class="order-main">
          <div class="order-main-layout">
            <div class="order-item" v-for="(item,index) in orderList" :key="item.id">
              <div class="order-item-top">
                <div class="order-item-top-header">
                  <div class="header-one">
                    <span class="mr-16rpx">订单号: {{ item.id }}</span>
                    <image :src="netConfig.picURL + '/static/order/copy.svg'" class="w-40rpx h-40rpx"></image>
                  </div>
                  <div class="header-two">{{ orderStatusMap[item.orderStatus] }}</div>
                </div>
                <div class="order-item-top-divider"></div>
                <div class="order-item-top-body">
                  <div class="title">
                    <span class="title-name">{{ item.spuDescribe }}</span>
                    <span>￥ {{ item.orderAmt / 100 }}</span>
                  </div>
                  <div class="detail">
                    <span class="text-[#ba2636]">{{ item.photoNum }}</span> 组精修、
                    拍摄 <span class="text-[#ba2636]">{{ Math.ceil((item.appointmentEndTime - item.appointmentStartTime) / (1000 * 60 * 60)) }}</span> 小时
                  </div>
                  <div class="tag">{{ item.spuDescribe }}</div>
                </div>
              </div>
              <div class="order-item-desc">
                <div class="order-item-desc-one">
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
                      <span class="mr-20rpx contakt">联系摄影师</span>
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
                    <div class="comment" v-if="item.orderStatus === 3">立即评价</div>
                    <div class="download" v-if="item.orderStatus === 3">下载照片</div>
                    <div class="download disabled" v-if="item.orderStatus !== 3">无操作</div>
                  </div>
                </div>  
              </div>
            </div>
          </div>
          <div class="no-more" v-if="noMore">
            <div class="line"></div>
            <span>没有更多了</span>
            <div class="line"></div>
          </div>
        </div>
      </scroll-view>
    </up-skeleton>
    <u-action-sheet
      :show="showActionSheet"
      :actions="actions"
      @close="showActionSheet = false"
      @select="handleActionSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import { getUserOrder, OrderVO } from '@/api/order';

const active = ref(0)
const orderList: any = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const isLoadingMore = ref(false)

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
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
  30: '退款成功'
};

const tabList = ref([
  { name: '全部', path: '/', status: undefined },
  { name: '待支付', path: '/discover', status: 0 },
  { name: '待确认', path: '/discover', status: 1 },
  { name: '待拍摄', path: '/discover', status: 2 },
  { name: '已拍摄', path: '/discover', status: 3 },
  { name: '待选图', path: '/my', status: 4 },
  { name: '修图中', path: '/my', status: 5 },
  { name: '待交付', path: '/my', status: 6 },
  { name: '待评价', path: '/my', status: 7 },
  { name: '已完成', path: '/my', status: 100 },
  { name: '已关闭', path: '/my', status: [9, 10, 11] }
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
      params.status = currentTab.status[0];
    } else {
      params.status = currentTab.status;
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
      params.status = currentTab.status[0];
    } else {
      params.status = currentTab.status;
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
    const list = res.data.list || [];
    if (list.length < pageSize.value) {
      noMore.value = true;
    }
    orderList.value = list;
  } catch (error) {
    console.error('获取订单列表失败:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getOrderList({ pageNo: 1, pageSize: 10 });
})
const showActionSheet = ref(false)
const currentOrder = ref<any>(null)

const actions = [
  { name: '申请退款', color: '#ba2636' },
  { name: '开具发票' }
]

const handleMoreClick = (item: any) => {
  currentOrder.value = item
  showActionSheet.value = true
}

const handleActionSelect = (item: any) => {
  showActionSheet.value = false
  if (item.name === '申请退款') {
    // TODO: 实现退款逻辑
    console.log('申请退款', currentOrder.value)
  } else if (item.name === '开具发票') {
    // TODO: 实现开票逻辑
    console.log('开具发票', currentOrder.value)
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
</style>