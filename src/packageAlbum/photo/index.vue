<template>
  <div class="photo-layout">
    <up-skeleton :loading="loading" :rows="3">
      <div class="photo">
        <div class="photo-item" v-for="(item, index) in list" :key="index" @click="previewPicture(item.originalUrl)">
          <image :src="item.picUrl" class="photo-item-image" mode="aspectFill" />
          <div class="checkbox">
            <up-checkbox usedAlone size="24" v-model:checked="item.selected" v-if="isSelected" shape="circle" activeColor="#ba2636" />
          </div>
        </div>
      </div>
    </up-skeleton>
    <!-- <up-loadmore :status="loadMoreStatus" /> -->
    <div class="footer-blank"></div>
    <div class="footer">
      <div class="footer-btn mr-30rpx footer-btn-1" @click="seeOriginal">底图</div>
      <div class="footer-btn mr-30rpx" @click="cancelSelected">取消选择</div>
      <div class="footer-btn" @click="handleSelected"> {{ isSelected ? '确认下载' : '批量选择' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getPhotoPage, getOrderOriginPhotos } from '@/api/home/photo';
  import { getAlbumPhoto } from '@/api/album';
  // import { useSts } from '@/hooks/useOss'

  // 定义页面参数
  const id = ref<string>('');
  const orderId = ref<string>('');
  const pageNo = ref<number>(1);
  const pageSize = ref<number>(100);
  const loading = ref<boolean>(true);
  const finished = ref<boolean>(false);
  const loadMoreStatus = ref<'loading' | 'nomore' | 'more'>('more');
  const orderInfo = ref<any>(null);

  // 定义图片列表
  const list = ref<Array<{ picUrl: string; selected: boolean; originalUrl: string }>>([]);
  const isSelected = ref<boolean>(false);
  // let getStsToken: () => Promise<void>;
  // let signatrueUrl: (url: string) => Promise<string>;

  // 获取相册照片
  const fetchAlbumPhotos = async () => {
    try {
      loading.value = true;
      const res = await getAlbumPhoto({ pageNo: pageNo.value, pageSize: pageSize.value, id: id.value });
      const processedList = await Promise.all(
        res.data.list.map(async (item: any) => {
          const baseUrl = item.bigPicUrl;
          return {
            picUrl: baseUrl + '/minipreview',
            originalUrl: baseUrl,
            selected: false,
          };
        })
      );

      if (pageNo.value === 1) {
        list.value = processedList;
      } else {
        list.value = [...list.value, ...processedList];
      }

      // if (res.data.list.length < pageSize.value) {
      //   finished.value = true;
      //   loadMoreStatus.value = 'nomore';
      // } else {
      //   loadMoreStatus.value = 'more';
      // }
    } catch (error) {
      uni.showToast({
        title: '加载失败，请重试',
        icon: 'none',
      });
      loadMoreStatus.value = 'more';
    } finally {
      loading.value = false;
    }
  };

  // 页面加载时获取参数
  onLoad(async (options: any) => {
    if (options.id || options.orderId) {
      id.value = options.id;
      orderId.value = options.orderId;

      await fetchAlbumPhotos();
    }
  });

  // 监听页面上拉触底事件
  // onReachBottom(async () => {
  //   if (!finished.value && loadMoreStatus.value !== 'loading') {
  //     loadMoreStatus.value = 'loading';
  //     pageNo.value++;
  //     await fetchAlbumPhotos();
  //   }
  // });

  // 定义图片预览函数
  const previewPicture = (currentUrl: string) => {
    const imageUrls = list.value.map(item => item.originalUrl);
    const currentIndex = list.value.findIndex(item => item.originalUrl === currentUrl);
    uni.previewImage({
      urls: imageUrls,
      current: imageUrls[currentIndex],
    });
  };

  const seeOriginal = () => {
    uni.navigateTo({
      url: `/packageAlbum/originalPhoto/index?orderId=${orderId.value}`,
    });
  };

  const cancelSelected = () => {
    isSelected.value = false;
  };

  const handleSelected = () => {
    if (isSelected.value) {
      // 如果是选择模式，执行确认选择
      if (orderInfo.value) {
        // TODO: 处理订单选图逻辑
        uni.showToast({
          title: '选图成功',
          icon: 'success',
        });
      } else {
        // 普通模式下执行下载
        downloadSelectedImages();
      }
    } else {
      // 如果是未选择模式，进入选择模式
      isSelected.value = true;
    }
  };

  const downloadSelectedImages = () => {
    uni.showToast({
      title: '保存中...',
      icon: 'loading',
    });
    const selectedImages = list.value.filter(item => item.selected).map(item => item.originalUrl);

    if (selectedImages.length > 0) {
      selectedImages.forEach(url => {
        // 下载图片
        uni.downloadFile({
          url: url,
          success: res => {
            if (res.statusCode === 200) {
              // 下载成功后获取本地路径
              const tempFilePath = res.tempFilePath;

              // 请求保存到相册权限
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  // 同意授权后保存图片到相册
                  uni.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success() {
                      uni.showToast({
                        title: '保存成功',
                        icon: 'success',
                      });
                    },
                    fail(err) {
                      console.error('保存图片到相册失败', err);
                      uni.showToast({
                        title: '保存失败',
                        icon: 'none',
                      });
                    },
                  });
                },
                fail() {
                  uni.showToast({
                    title: '需要授权才能保存图片',
                    icon: 'none',
                  });
                },
              });
            } else {
              console.error(`下载失败: ${url}`);
              uni.showToast({
                title: '下载失败',
                icon: 'none',
              });
            }
          },
          fail: err => {
            console.error(`下载失败: ${url}`, err);
            uni.showToast({
              title: `${err.errMsg}`,
              icon: 'none',
            });
          },
        });
      });
    } else {
      uni.showToast({
        title: '请选择图片进行下载',
        icon: 'none',
      });
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
          width: 100%;
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

        &-1 {
          width: 100rpx;
          background-color: #ba2636;
        }
      }

      &-blank {
        width: 100vw;
        height: 200rpx;
      }
    }
  }
</style>
