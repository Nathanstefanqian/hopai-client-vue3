<template>
  <div class="invoice-page">
    <div class="header-sticky">
      <up-tabs :list="tabList" v-model:current="activeTab" lineColor="#ba2636" :activeStyle="{
          color: '#ba2636',
          fontWeight: 'bold',
          transform: 'scale(1.05)'
      }"  />
    </div>
    <div class="header-sticky-blank"></div>
    <swiper class="swiper-container" :current="activeTab" @change="handleSwiperChange">
      <swiper-item>
        <scroll-view scroll-y class="scroll-view">
          <div class="order-list">
            <div v-for="item in orderList" :key="item.id" class="order-item" :class="{ 'selected': item.checked }" @click="handleOrderItemClick(item)">
                <div class="order-item-header">
                  <div class="checkbox">
                      <up-checkbox :name="item.id" v-model:checked="item.checked" usedAlone activeColor="#ba2636" />
                  </div>
                  <div class="order-info">
                    <div class="order-number">订单号：{{ item.orderNumber }}</div>
                    <div class="order-time">{{ item.orderTime }}</div>
                  </div>
                  <div class="order-price" style="color: #ba2636;">¥{{ item.price }}</div>
                </div>
                <div class="order-item-body">
                    <div class="service-info">
                      <div class="service-name">{{ item.serviceName }}</div>
                      <div class="service-time" data-label="预约时间：">{{ formatTime(item.appointmentStartTime) }} - {{ formatTime(item.appointmentEndTime) }}</div>
                      <div class="service-location" data-label="预约地点：">{{ item.location }}</div>
                      <div class="service-photographer" data-label="摄影师：">{{ item.photographerName }} {{ item.photographerPhone }}</div>
                    </div>
                </div>
          </div>
        </div>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y class="scroll-view">
          <div class="order-list">
            <div v-for="item in recordList" :key="item.id" class="order-item">
              <div class="order-item-header">
                <div class="order-info">
                  <div class="order-number">发票号：{{ item.invoiceId }}</div>
                  <div class="order-time">{{ item.invoiceTime }}</div>
                </div>
                <div class="order-price" style="color: #ba2636;">¥{{ item.price }}</div>
              </div>
              <div class="order-item-body">
                <div class="service-info">
                  <div class="service-name">{{ item.title }}</div>
                  <div class="service-desc">{{ item.desc }}</div>
                  <div class="service-desc">开票类型: {{ item.invoiceType ? '个人开票' : '企业开票' }}</div>
                </div>
                <div class="service-tag">{{ item.status }}</div>
              </div>
            </div>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
    <div class="invoice-footer">
      <div class="invoice-footer-box1" >
        共<span style="color: #ba2636;">¥{{ selectedPrice }}</span>元
      </div>
      <div class="invoice-footer-box2">
        <div class="checkbox">
          <up-checkbox usedAlone shape="circle" v-model:checked="aloneChecked" class="mr-10rpx" activeColor="#ba2636" @change="handleAllCheck" />
          <span class="mr-10rpx">全选</span>
        </div>
        <div class="btn" @click="handleNext">下一步</div>
      </div>
    </div>
    <div class="invoice-footer-blank"></div>
  </div>
</template>

<script setup lang="ts">
import { getUserCanInvoiceOrders, getUserInvoiceList } from '@/api/order'

interface TabItem {
  name: string;
}

interface OrderItem {
  id: string | number;
  orderNumber: string | number;
  orderTime: string;
  actualAmt: number;
  serviceName: string;
  serviceDesc: string;
  serviceTag: string;
  checked: boolean;
}

interface InvoiceRecord {
  id: number;
  invoiceId: string;
  invoiceTime: string;
  price: number;
  title: string;
  desc: string;
  status: string;
  invoiceType: string;
}

const tabList: TabItem[] = [
  { name: '开票订单' },
  { name: '开票记录' }
]

const activeTab = ref(0)
const aloneChecked = ref(false)
const pageNo = ref(1)
const pageSize = ref(20)

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

const orderList = ref<OrderItem[] | any[]>([]);

const loadOrders = async () => {
  try {
    const res = await getUserCanInvoiceOrders({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: [1] // 添加状态参数，获取可开票订单
    });
    if (res.data) {
      orderList.value = res.data.list.map((item: any) => ({
        id: item.id,
        orderNumber: item.id,
        orderTime: formatTime(item.createTime),
        price: (item.orderAmt / 100).toFixed(2),
        serviceName: item.spuDescribe,
        appointmentStartTime: item.appointmentStartTime,
        appointmentEndTime: item.appointmentEndTime,
        location: item.location,
        photographerName: item.photographerName,
        photographerPhone: item.photographerPhone,
        checked: false
      }));
    }
  } catch (error) {
    console.error('获取订单列表失败：', error);
  }
};

const recordList = ref<InvoiceRecord[]>([]);

const loadInvoiceRecords = async () => {
  try {
    const res = await getUserInvoiceList({
      pageNo: pageNo.value,
      pageSize: pageSize.value
    });
    if (res.data) {
      recordList.value = res.data.list.map((item: any) => ({
        id: item.id,
        invoiceId: item.invoiceId,
        invoiceTime: formatTime(item.createTime),
        price: (item.invoiceAmount / 100).toFixed(2),
        title: item.invoiceTitle,
        desc: `税号：${item.taxNumber}`,
        invoiceType: item.invoiceType,
        status: item.invoiceStatus === 0 ? '开票中' : '已开票'
      }));
    }
  } catch (error) {
    console.error('获取发票记录失败：', error);
  }
};

onMounted(() => {
  loadOrders();
  loadInvoiceRecords();
});

interface SwiperChangeEvent {
  detail: {
    current: number;
  };
}

const handleSwiperChange = (e: SwiperChangeEvent) => {
  activeTab.value = e.detail.current;
};

const selectedPrice = computed(() => {
  return orderList.value
    .filter(item => item.checked)
    .reduce((total, item) => total + parseFloat(item.price), 0)
    .toFixed(2)
})

const handleAllCheck = () => {
  orderList.value.forEach(item => item.checked = !aloneChecked.value)
}

const handleNext = () => {
  const selectedOrders = orderList.value
    .filter(item => item.checked)
    .map(item => ({
      orderId: item.orderNumber,
      itemAmount: parseFloat(item.price)
    }));

  if (selectedOrders.length === 0) {
    uni.showToast({
      title: '请选择需要开票的订单',
      icon: 'none'
    });
    return;
  }

  uni.navigateTo({
    url: `/packageMy/invoice/create?orders=${encodeURIComponent(JSON.stringify(selectedOrders))}&invoiceAmount=${selectedPrice.value}`
  });
}

const handleOrderItemClick = (item: OrderItem) => {
  item.checked = !item.checked;
}

// 模拟开票记录数据
// const recordList = ref<InvoiceRecord[]>([
//   {
//     id: 1,
//     invoiceNumber: 'FP202312270001',
//     invoiceTime: '2023.12.27 9:30:28',
//     price: 399.00,
//     title: '摄影服务费',
//     desc: '包含2组服务项目',
//     status: '已开票'
//   },
//   {
//     id: 2,
//     invoiceNumber: 'FP202312280002',
//     invoiceTime: '2023.12.28 14:20:33',
//     price: 899.00,
//     title: '婚纱摄影套餐',
//     desc: '含化妆、拍摄、精修服务',
//     status: '已开票'
//   },
//   {
//     id: 3,
//     invoiceNumber: 'FP202312290003',
//     invoiceTime: '2023.12.29 16:45:12',
//     price: 599.00,
//     title: '儿童写真套餐',
//     desc: '含2组造型、10张精修',
//     status: '开票中'
//   }
// ])
</script>

<style lang="scss" scoped>
.invoice-page {
  min-height: 100vh;
  background: #f7f8fa;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.swiper-container {
  flex: 1;
  height: calc(100vh - 130rpx);
}

.scroll-view {
  height: 100%;
}

.header-sticky {
  width: 100%;
  height: 130rpx;
  box-sizing: border-box;
  background: #fff;
  border-bottom: 1px solid #eaedf1;
  padding: 24rpx 32rpx;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;

  &-blank {
    width: 100%;
    height: 150rpx;
  }
}

.order-list {
  padding: 32rpx;
  margin: 0 auto;
  max-width: 960px;
  box-sizing: border-box;
}

.order-item {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  padding: 48rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.selected {
    border: 2rpx solid #ba2636;
    box-shadow: 0 4rpx 12rpx rgba(186, 38, 54, 0.2);
    transform: translateY(-4rpx);
  }
}

.order-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding-bottom: 40rpx;
  border-bottom: 1px solid #eaedf1;

  .checkbox {
    margin-right: 40rpx;
  }

  .order-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  
    .order-number {
      font-size: 32rpx;
      color: #1a1f36;
      font-weight: 500;
    }
  
    .order-time {
      font-size: 28rpx;
      color: #697386;
    }
  }

  .order-price {
    font-size: 40rpx;
    font-weight: 600;
  }
}

.order-item-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .service-info {
    flex: 1;

    .service-name {
      font-size: 32rpx;
      color: #1a1f36;
      margin-bottom: 20rpx;
      font-weight: 500;
    }

    .service-time,
    .service-location,
    .service-photographer {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12rpx;
      font-size: 28rpx;
      color: #697386;
      line-height: 1.6;

      &::before {
        content: attr(data-label);
        flex: 0 0 140rpx;
        color: #697386;
      }
    }
  }

  .service-desc {
    font-size: 28rpx;
    color: #697386;
    line-height: 1.6;
  }

  .service-tag {
    font-size: 28rpx;
    color: #ba2636;
    background: #fff1f0;
    padding: 12rpx 32rpx;
    border-radius: 12rpx;
    font-weight: 500;
  }
}

.invoice-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100vw;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);

  &-box1 {
    width: 100%;
    padding: 10rpx 40rpx;
    box-sizing: border-box;
    border-bottom: 2rpx solid #eaedf1 !important;
  }

  &-box2 {
    display: flex;
    align-items: center;
    width: 100%;
    height: 150rpx;
    box-sizing: border-box;
    padding: 10rpx 20rpx;
    justify-content: space-between;

    .checkbox {
      margin-left: 50rpx;
      display: flex;
      align-items: center;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #000;
      margin-right: 50rpx;
      color: #fff;
      padding: 10rpx 20rpx;
      width: 240rpx;
      box-sizing: border-box;
      height: 80rpx;
      border-radius: 10rpx;
    }
  }
}

.invoice-footer-blank {
  width: 100%;
  height: 200rpx;
}
</style>
