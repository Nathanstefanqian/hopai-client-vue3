<template>
  <div class="photo-layout">
    <up-skeleton :loading="loading" :rows="3">
      <div class="photo">
        <div class="photo-item" v-for="(item, index) in list" :key="index" @click="previewPicture(item.originalUrl)">
          <image :src="item.picUrl" class="photo-item-image" mode="aspectFill" lazy-load="true" />
          <div class="checkbox">
            <up-checkbox usedAlone v-model:checked="item.selected" v-if="isSelected" shape="circle" activeColor="#ba2636" />
          </div>
        </div>
      </div>
    </up-skeleton>
    <!-- <up-loadmore :status="loadMoreStatus" /> -->
    <div class="footer-blank"></div>
    <div class="footer">
      <div class="footer-btn mr-30rpx" @click="cancelSelected">取消选择</div>
      <div class="footer-btn" @click="handleSelected"> {{ isSelected ? (selectedCount === MAX_SELECTED ? '确认提交' : `已选 ${selectedCount} / ${MAX_SELECTED}`) : '批量选择' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPhotoPage, getOrderOriginPhotos } from '@/api/home/photo'
import { selectUserPhotos } from '@/api/order'

// 定义页面参数
const id = ref<string>('');
const orderId = ref<string>('');
const pageNo = ref<number>(1);
const pageSize = ref<number>(20);
const loading = ref<boolean>(true);
const finished = ref<boolean>(false);
// const loadMoreStatus = ref<'loading' | 'nomore' | 'more'>('more');
const orderInfo = ref<any>(null);

// 定义图片列表
const list = ref<any>([]);
const isSelected = ref<boolean>(false);
const MAX_SELECTED = 12;

// 计算已选择的图片数量
const selectedCount = computed(() => list.value.filter(item => item.selected).length);
// let getStsToken: () => Promise<void>;
// let signatrueUrl: (url: string) => Promise<string>;

// 获取订单原图数据
const fetchOrderPhotos = async () => {
  try {
    loading.value = true;
    const res = await getOrderOriginPhotos(orderId.value);
    list.value = res.data.map(item => ({ ...item, selected: false }));
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
  if (options.orderId) {
    orderId.value = options.orderId;
    await fetchOrderPhotos();
  }
})

// // 监听页面上拉触底事件
// onReachBottom(async () => {
//   if (!finished.value && loadMoreStatus.value !== 'loading') {
//     loadMoreStatus.value = 'loading';
//     pageNo.value++;
//     // await fetchAlbumPhotos();
//   }
// });

// 定义图片预览函数
const previewPicture = (currentUrl: string) => {
  const imageUrls = list.value.map(item => item.originalUrl);
  const currentIndex = list.value.findIndex(item => item.originalUrl === currentUrl);
  uni.previewImage({
    urls: imageUrls,
    current: imageUrls[currentIndex]
  });
}

const cancelSelected = () => {
  isSelected.value = false
  list.value.map(item => item.selected = false)
}

const handlePhotoSelect = (item: any) => {
  if (item.selected) {
    item.selected = false;
  } else if (selectedCount.value < MAX_SELECTED) {
    item.selected = true;
  } else {
    uni.showToast({
      title: `最多只能选择${MAX_SELECTED}张图片`,
      icon: 'none'
    });
  }
};

const handleSelected = () => {
  if (isSelected.value) {
    // 如果是选择模式，执行确认选择
    console.log(list.value)
    if (selectedCount.value === MAX_SELECTED) {
      const selectedIds = list.value
        .filter(item => item.selected)
        .map(item => item.id);
      console.log(selectedIds)
      selectUserPhotos(orderId.value, selectedIds)
        .then(() => {
          uni.showToast({
            title: '选图成功',
            icon: 'success'
          });
          // 选图成功后返回上一页
          uni.navigateBack();
        })
        .catch(err => {
          uni.showToast({
            title: '选图失败，请重试',
            icon: 'none'
          });
        });
    } else {
      uni.showToast({
        title: `请选择${MAX_SELECTED}张图片`,
        icon: 'none'
      });
    }
  } else {
    // 如果是未选择模式，进入选择模式
    isSelected.value = true;
  }
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