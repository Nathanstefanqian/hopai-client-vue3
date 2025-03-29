<template>
  <div class="photo-layout">
    <up-skeleton :loading="loading" :rows="3">
      <div class="photo">
        <div class="photo-item" v-for="(item, index) in list" :key="index" @click="previewPicture(item.originalUrl)">
          <image :src="item.picUrl" class="photo-item-image" mode="aspectFill" />
        </div>
        <div class="photo-tip">如果精修图不满意，请联系摄影师重新上传</div>
      </div>
    </up-skeleton>
    <!-- <up-loadmore :status="loadMoreStatus" /> -->
    <div class="footer-blank"></div>
    <div class="footer">
      <div class="footer-btn mr-30rpx" @click="handleConfirm">确认交付</div>
      <div class="footer-btn" @click="handleContact">联系摄影师</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPhotoPage, getOrderOriginPhotos } from '@/api/home/photo'
import { getTruingPhotos, finishOrder } from '@/api/order/index'
// import { useSts } from '@/hooks/useOss'

// 定义页面参数
const id = ref<string>('');
const orderId = ref<string>('');
const pageNo = ref<number>(1);
const pageSize = ref<number>(20);
const loading = ref<boolean>(true);
const finished = ref<boolean>(false);
const loadMoreStatus = ref<'loading' | 'nomore' | 'more'>('more');
const orderInfo = ref<any>(null);

// 定义图片列表
const list = ref<Array<{ picUrl: string; originalUrl: string }>>([]);

// 获取订单原图数据
const fetchOrderPhotos = async () => {
  try {
    loading.value = true;
    const res = await getTruingPhotos(orderId.value);
    const processedList = res.data.map((item: any) => ({
      picUrl: item.picUrl,
      originalUrl: item.picUrl
    }));
    list.value = processedList;
  } catch (error) {
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};



// 页面加载时获取参数
onLoad(async (options: any) => {
  if (options.id || options.orderId) {
    id.value = options.id;
    orderId.value = options.orderId;
    await fetchOrderPhotos();
  }
});



// 定义图片预览函数
const previewPicture = (currentUrl: string) => {
  const imageUrls = list.value.map(item => item.originalUrl);
  const currentIndex = list.value.findIndex(item => item.originalUrl === currentUrl);
  uni.previewImage({
    urls: imageUrls,
    current: imageUrls[currentIndex]
  });
}

// 确认交付处理函数
const handleConfirm = async () => {
  try {
    await finishOrder(orderId.value);
    uni.showToast({
      title: '确认交付成功',
      icon: 'success'
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    });
  }
}

// 联系客服处理函数
const handleContact = () => {
  // 这里可以添加联系客服的具体实现
  uni.showToast({
    title: '正在连接客服',
    icon: 'none'
  });
}
</script>

<style lang="scss" scoped>
.photo-layout {
  width: 100vw;
  min-height: 100vh;
  background-color: #f6f6f6;
  padding: 32rpx;
  box-sizing: border-box;

  .photo {
    display: flex;
    flex-wrap: wrap;
    &-item {
      position: relative;
      margin-right: 20rpx;
      margin-bottom: 20rpx;

      &-image {
        width: 210rpx;
        height: 280rpx;
        border-radius: 12rpx;
      }

      .checkbox {
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    &-tip {
      width: 100%;
      text-align: center;
      font-size: 24rpx;
      color: #999;
      margin-top: 20rpx;
    }
  }

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 160rpx;
    padding: 32rpx 32rpx 48rpx 32rpx;
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100vw;
    background-color: #fff;

    &-btn {
      width: 240rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #000;
      color: #fff;
      padding: 24rpx;
    }

    &-blank {
      width: 100vw;
      height: 200rpx;
    }
  }
}
</style>
