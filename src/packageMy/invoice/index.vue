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
                  <div class="order-price">¥{{ item.price }}</div>
                </div>
                <div class="order-item-body">
                    <div class="service-info">
                      <div class="service-name">{{ item.serviceName }}</div>
                      <div class="service-desc">{{ item.serviceDesc }}</div>
                    </div>
                    <div class="service-tag">{{ item.serviceTag }}</div>
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
                  <div class="order-number">发票号：{{ item.invoiceNumber }}</div>
                  <div class="order-time">{{ item.invoiceTime }}</div>
                </div>
                <div class="order-price">¥{{ item.price }}</div>
              </div>
              <div class="order-item-body">
                <div class="service-info">
                  <div class="service-name">{{ item.title }}</div>
                  <div class="service-desc">{{ item.desc }}</div>
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
        共<span style="color: #ba2636;">399.00</span>元
      </div>
      <div class="invoice-footer-box2">
        <div class="checkbox">
          <up-checkbox usedAlone shape="circle" v-model:checked="aloneChecked" class="mr-10rpx" activeColor="#ba2636" @change="handleAllCheck" />
          <span class="mr-10rpx">全选</span>
          <div>
            <span>已选中</span>
            <span style="color: #ba2636;">{{ ' ' + selectedPrice + ' ' }}</span>元
          </div>
        </div>
        <div class="btn" @click="handleNext">下一步</div>
      </div>
    </div>
    <div class="invoice-footer-blank"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getUserCanInvoiceOrders } from '@/api/order'

const tabList = [
  { name: '开票订单' },
  { name: '开票记录' }
]

const activeTab = ref(0)
const aloneChecked = ref(false)
const pageNo = ref(1)
const pageSize = ref(20)

const loadOrders = async () => {
  try {
    const res = await getUserCanInvoiceOrders({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      status: [2]
    })
    console.log('打印记录', res)
    if (res.data?.records) {
      orderList.value = res.data.records.map((item: any) => ({
        ...item,
        checked: false
      }))
    }
  } catch (error) {
    console.error('获取订单列表失败：', error)
  }
}

onMounted(() => {
  loadOrders()
})
// const handleTabChange = (index: number) => {
//    console.log(index)
//   activeTab.value = index
// }

const handleSwiperChange = (e: any) => {
  console.log(e)
  activeTab.value = e.detail.current
}

// 模拟订单数据
const orderList = ref([
  {
    id: 1,
    orderNumber: '1521121a7198212',
    orderTime: '2023.12.27 9:00:28',
    price: 399.00,
    serviceName: '提供服务赠送精修（标题）',
    serviceDesc: '2组/12精修，拍摄2小时',
    serviceTag: '活动会议',
    checked: false
  },
  {
    id: 2,
    orderNumber: '1521121b7198213',
    orderTime: '2023.12.27 10:15:33',
    price: 599.00,
    serviceName: '婚纱照拍摄套餐',
    serviceDesc: '4组造型，8小时拍摄，30张精修',
    serviceTag: '婚纱摄影',
    checked: false
  },
  {
    id: 3,
    orderNumber: '1521121c7198214',
    orderTime: '2023.12.27 11:30:45',
    price: 299.00,
    serviceName: '证件照拍摄',
    serviceDesc: '2寸/1寸各4张，现场打印',
    serviceTag: '证件照',
    checked: false
  },
  {
    id: 4,
    orderNumber: '1521121d7198215',
    orderTime: '2023.12.27 13:45:12',
    price: 899.00,
    serviceName: '全家福拍摄套餐',
    serviceDesc: '3组造型，4小时拍摄，20张精修',
    serviceTag: '全家福',
    checked: false
  },
  {
    id: 5,
    orderNumber: '1521121e7198216',
    orderTime: '2023.12.27 15:20:08',
    price: 499.00,
    serviceName: '儿童写真套餐',
    serviceDesc: '2组造型，2小时拍摄，15张精修',
    serviceTag: '儿童摄影',
    checked: false
  },
  {
    id: 6,
    orderNumber: '1521121f7198217',
    orderTime: '2023.12.27 16:40:55',
    price: 699.00,
    serviceName: '商业产品拍摄',
    serviceDesc: '10件产品拍摄，含精修',
    serviceTag: '商业摄影',
    checked: false
  },
  {
    id: 7,
    orderNumber: '1521121g7198218',
    orderTime: '2023.12.27 17:55:23',
    price: 799.00,
    serviceName: '毕业照团体拍摄',
    serviceDesc: '班级合影+个人照，3小时拍摄',
    serviceTag: '毕业照',
    checked: false
  },
  {
    id: 8,
    orderNumber: '1521121h7198219',
    orderTime: '2023.12.28 9:15:42',
    price: 349.00,
    serviceName: '宠物写真套餐',
    serviceDesc: '1小时拍摄，10张精修',
    serviceTag: '宠物摄影',
    checked: false
  },
  {
    id: 9,
    orderNumber: '1521121i7198220',
    orderTime: '2023.12.28 10:30:18',
    price: 999.00,
    serviceName: '企业形象拍摄',
    serviceDesc: '团队照+环境照，半天拍摄',
    serviceTag: '企业摄影',
    checked: false
  },
  {
    id: 10,
    orderNumber: '1521121j7198221',
    orderTime: '2023.12.28 11:45:36',
    price: 459.00,
    serviceName: '艺术写真套餐',
    serviceDesc: '2组造型，3小时拍摄，15张精修',
    serviceTag: '艺术写真',
    checked: false
  },
  {
    id: 11,
    orderNumber: '1521121k7198222',
    orderTime: '2023.12.28 13:20:47',
    price: 599.00,
    serviceName: '孕妇写真套餐',
    serviceDesc: '3组造型，3小时拍摄，20张精修',
    serviceTag: '孕妇照',
    checked: false
  },
  {
    id: 12,
    orderNumber: '1521121l7198223',
    orderTime: '2023.12.28 14:40:15',
    price: 299.00,
    serviceName: '形象照拍摄',
    serviceDesc: '1组造型，1小时拍摄，5张精修',
    serviceTag: '形象照',
    checked: false
  },
  {
    id: 13,
    orderNumber: '1521121m7198224',
    orderTime: '2023.12.28 15:55:33',
    price: 899.00,
    serviceName: '婚礼跟拍服务',
    serviceDesc: '全天跟拍，100张精修',
    serviceTag: '婚礼摄影',
    checked: false
  },
  {
    id: 14,
    orderNumber: '1521121n7198225',
    orderTime: '2023.12.28 17:10:22',
    price: 499.00,
    serviceName: '闺蜜写真套餐',
    serviceDesc: '2人拍摄，3组造型，15张精修',
    serviceTag: '闺蜜照',
    checked: false
  },
  {
    id: 15,
    orderNumber: '1521121o7198226',
    orderTime: '2023.12.29 9:25:44',
    price: 699.00,
    serviceName: '情侣写真套餐',
    serviceDesc: '2人拍摄，4组造型，20张精修',
    serviceTag: '情侣照',
    checked: false
  },
  {
    id: 16,
    orderNumber: '1521121p7198227',
    orderTime: '2023.12.29 10:40:12',
    price: 399.00,
    serviceName: '个人形象写真',
    serviceDesc: '2组造型，2小时拍摄，10张精修',
    serviceTag: '个人写真',
    checked: false
  },
  {
    id: 17,
    orderNumber: '1521121q7198228',
    orderTime: '2023.12.29 11:55:29',
    price: 799.00,
    serviceName: '旅拍套餐',
    serviceDesc: '外景拍摄，4小时，25张精修',
    serviceTag: '旅拍',
    checked: false
  },
  {
    id: 18,
    orderNumber: '1521121r7198229',
    orderTime: '2023.12.29 13:15:37',
    price: 599.00,
    serviceName: '亲子写真套餐',
    serviceDesc: '3口之家，3组造型，15张精修',
    serviceTag: '亲子照',
    checked: false
  },
  {
    id: 19,
    orderNumber: '1521121s7198230',
    orderTime: '2023.12.29 14:30:55',
    price: 459.00,
    serviceName: '宝宝百天照',
    serviceDesc: '2组造型，2小时拍摄，12张精修',
    serviceTag: '百天照',
    checked: false
  },
  {
    id: 20,
    orderNumber: '1521121t7198231',
    orderTime: '2023.12.29 15:45:18',
    price: 899.00,
    serviceName: '私人定制写真',
    serviceDesc: '5组造型，6小时拍摄，30张精修',
    serviceTag: '定制写真',
    checked: false
  }
])

const selectedPrice = computed(() => {
  return orderList.value
    .filter(item => item.checked)
    .reduce((total, item) => total + item.price, 0)
})

const handleAllCheck = () => {
  orderList.value.forEach(item => item.checked = !aloneChecked.value)
}



const handleNext = () => {
  uni.navigateTo({
    url: '/packageMy/invoice/create'
  })
}

const handleOrderItemClick = (item: any) => {
  item.checked = !item.checked;
}

// 模拟开票记录数据
const recordList = ref([
  {
    id: 1,
    invoiceNumber: 'FP202312270001',
    invoiceTime: '2023.12.27 9:30:28',
    price: 399.00,
    title: '摄影服务费',
    desc: '包含2组服务项目',
    status: '已开票'
  },
  {
    id: 2,
    invoiceNumber: 'FP202312280002',
    invoiceTime: '2023.12.28 14:20:33',
    price: 899.00,
    title: '婚纱摄影套餐',
    desc: '含化妆、拍摄、精修服务',
    status: '已开票'
  },
  {
    id: 3,
    invoiceNumber: 'FP202312290003',
    invoiceTime: '2023.12.29 16:45:12',
    price: 599.00,
    title: '儿童写真套餐',
    desc: '含2组造型、10张精修',
    status: '开票中'
  }
])
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

    .order-number {
      font-size: 32rpx;
      color: #1a1f36;
      font-weight: 500;
    }

    .order-time {
      font-size: 28rpx;
      color: #697386;
      margin-top: 16rpx;
    }
  }

  .order-price {
    font-size: 40rpx;
    color: #1a1f36;
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

    .service-desc {
      font-size: 28rpx;
      color: #697386;
      line-height: 1.6;
    }
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

  &-blank {
    width: 100%;
    height: 200rpx;
  }


}
</style>