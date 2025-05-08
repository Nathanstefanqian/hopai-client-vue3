<template>
  <div class="photo-layout">
    <up-skeleton :loading="loading" :rows="3">
      <div class="photo">
        <div class="photo-item" v-for="(item, index) in list" :key="index" @click="previewPicture(item.originalUrl)">
          <image :src="item.picUrl" class="photo-item-image" mode="aspectFill" lazy-load="true" />
          <div class="checkbox">
            <up-checkbox usedAlone size="24" v-model:checked="item.selected" v-if="isSelected" shape="circle" activeColor="#ba2636" />
          </div>
        </div>
      </div>
      <up-loadmore :status="loadMoreStatus" />
    </up-skeleton>
    <div class="footer-blank"></div>
    <div class="footer">
      <div class="footer-btn mr-30rpx" @click="cancelSelected">取消选择</div>
      <div class="footer-btn" @click="handleSelected"> {{ isSelected ? (selectedCount === MAX_SELECTED ? '确认提交' : `已选 ${selectedCount} / ${MAX_SELECTED}`) : '选择图片' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getPhotoPage, getOrderOriginPhotos } from '@/api/home/photo';
  import { selectUserPhotos } from '@/api/order';

  interface PhotoItem {
    id: string;
    picUrl: string;
    originalUrl: string;
    selected: boolean;
  }

  // 定义页面参数
  const id = ref<string>('');
  const orderId = ref<string>('');
  const pageNo = ref<number>(1);
  const pageSize = ref<number>(12);
  const loading = ref<boolean>(true);
  const finished = ref<boolean>(false);
  const loadMoreStatus = ref<'loading' | 'nomore' | 'loadmore' | 'undefined'>('loadmore');
  const orderInfo = ref<any>(null);

  // 定义图片列表
  const allPhotos = ref<PhotoItem[]>([]); // 存储所有图片
  const list = ref<PhotoItem[]>([]); // 当前显示的图片
  const isSelected = ref<boolean>(false);
  const MAX_SELECTED = 12;

  // 计算已选择的图片数量
  const selectedCount = computed(() => list.value.filter(item => item.selected).length);

  // 获取订单原图数据
  const fetchOrderPhotos = async () => {
    try {
      loading.value = true;
      const res = await getOrderOriginPhotos(orderId.value);

      allPhotos.value = res.data.map((item: any) => ({
        ...item,
        selected: false,
        originalUrl: item.picUrl,
        picUrl: item.picUrl + '/minipreview',
      }));
      // 初始加载第一页数据
      loadMorePhotos();
    } catch (error) {
      uni.showToast({
        title: '加载失败，请重试',
        icon: 'none',
      });
    } finally {
      loading.value = false;
    }
  };

  // 加载更多图片
  const loadMorePhotos = () => {
    const start = (pageNo.value - 1) * pageSize.value;
    const end = pageNo.value * pageSize.value;
    const newPhotos = allPhotos.value.slice(start, end);

    if (newPhotos.length > 0) {
      setTimeout(() => {
        list.value = [...list.value, ...newPhotos];
        loadMoreStatus.value = start + pageSize.value >= allPhotos.value.length ? 'nomore' : 'loadmore';
      }, 500);
    } else {
      loadMoreStatus.value = 'nomore';
    }
    loading.value = false;
  };

  // 页面加载时获取参数
  onLoad(async (options: any) => {
    if (options.orderId) {
      orderId.value = options.orderId;
      await fetchOrderPhotos();
    }
  });

  // 监听页面上拉触底事件
  onReachBottom(async () => {
    if (loadMoreStatus.value === 'loadmore') {
      loadMoreStatus.value = 'loading';
      pageNo.value++;
      loadMorePhotos();
    }
  });

  // 定义图片预览函数
  const previewPicture = (currentUrl: string) => {
    const currentIndex = list.value.findIndex(item => item.originalUrl === currentUrl);
    const startIndex = Math.max(0, currentIndex - 5);
    const endIndex = Math.min(list.value.length, startIndex + 10);
    const previewUrls = list.value.slice(startIndex, endIndex).map(item => item.originalUrl);

    uni.previewImage({
      urls: previewUrls,
      current: currentUrl,
    });
  };

  const cancelSelected = () => {
    isSelected.value = false;
    list.value.map(item => (item.selected = false));
  };

  const handlePhotoSelect = (item: PhotoItem) => {
    if (item.selected) {
      item.selected = false;
    } else if (selectedCount.value < MAX_SELECTED) {
      item.selected = true;
    } else {
      uni.showToast({
        title: `最多只能选择${MAX_SELECTED}张图片`,
        icon: 'none',
      });
    }
  };

  const handleSelected = () => {
    if (isSelected.value) {
      // 如果是选择模式，执行确认选择
      console.log(list.value);
      if (selectedCount.value === MAX_SELECTED) {
        const selectedIds = list.value.filter(item => item.selected).map(item => item.id);
        selectUserPhotos(orderId.value, selectedIds)
          .then(() => {
            uni.showToast({
              title: '选图成功',
              icon: 'success',
            });
            // 选图成功后返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          })
          .catch(err => {
            uni.showToast({
              title: '选图失败，请重试',
              icon: 'none',
            });
          });
      } else {
        uni.showToast({
          title: `请选择${MAX_SELECTED}张图片`,
          icon: 'none',
        });
      }
    } else {
      // 如果是未选择模式，进入选择模式
      isSelected.value = true;
    }
  };
</script>

<style lang="scss" scoped>
  .photo-layout {
    width: 100vw;
    min-height: 100vh;
    background-color: #f6f6f6;
    padding: 32rpx;
    box-sizing: border-box;
    overflow: hidden;

    .photo {
      display: flex;
      flex-wrap: wrap;
      &-item {
        position: relative;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        width: calc((100% - 70rpx) / 3);

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
