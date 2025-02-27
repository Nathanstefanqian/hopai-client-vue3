<template>
  <div class="photo-layout">
    <div class="photo">
      <div class="photo-item" v-for="(item, index) in list" :key="index" @click="isSelected ? item.selected = !item.selected : previewPicture(item.image)">
        <image :src="item.image" class="photo-item-image" mode="aspectFill" />
        <div class="checkbox">
          <up-checkbox usedAlone v-model:checked="item.selected" v-if="isSelected" shape="circle" activeColor="#ba2636" />
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-btn mr-30rpx" @click="cancelSelected">取消选择</div>
      <div class="footer-btn" @click="handleSelected"> {{ isSelected == true ? '确认下载' : '批量选择' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义图片列表
const list = ref([
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/1.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/2.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/3.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/4.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/5.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/6.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/7.jpg', selected: false },
  { image: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/8.jpg', selected: false }
]);

const isSelected = ref<boolean>(false)

// 定义图片预览函数
const previewPicture = (currentUrl: string) => {
  const imageUrls = list.value.map(item => item.image); // 从list中提取出所有的图片url
  uni.previewImage({
    urls: imageUrls,  // 这里使用的是图片列表 `list`
    current: currentUrl  // 当前点击的图片
  });
}

const cancelSelected = () => {
  isSelected.value = false
  list.value.map(item => item.selected = false)
}

const handleSelected = () => {
  if (isSelected.value) {
    // 如果是选择模式，执行下载
    downloadSelectedImages();
  } else {
    // 如果是未选择模式，进入选择模式
    isSelected.value = true;
  }
}
const downloadSelectedImages = () => {
  const selectedImages = list.value.filter(item => item.selected).map(item => item.image);
  
  if (selectedImages.length > 0) {
    selectedImages.forEach((url) => {
      // 下载图片
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            // 下载成功后获取本地路径
            const tempFilePath = res.tempFilePath;

            // 请求保存到相册权限
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                // 同意授权后保存图片到相册
                uni.saveImageToPhotosAlbum({
                  filePath: tempFilePath,  // 使用下载得到的临时文件路径
                  success() {
 
                  },
                  fail(err) {
                    console.error('保存图片到相册失败', err);
                    uni.showToast({
                      title: '保存失败',
                      icon: 'none'
                    });
                    return
                  }
                });
              },
              fail() {
                // 用户拒绝授权
                uni.showToast({
                  title: '需要授权才能保存图片',
                  icon: 'none'
                })
                return
              }
            });
          } else {
            console.error(`下载失败: ${url}`);
            uni.showToast({
              title: '下载失败123',
              icon: 'none'
            });
            return
          }
        },
        fail: (err) => {
          console.error(`下载失败: ${url}`, err);
          uni.showToast({
            title: `${err.errMsg}`,
            icon: 'none'
          });
          return
        }
      });
    });
  } else {
    uni.showToast({
      title: '请选择图片进行下载',
      icon: 'none'
    });
  }
  console.log('图片已保存到相册');
  uni.showToast({
    title: '图片已保存到相册',
    icon: 'success'
  });
}
</script>
// todo 进度条，懒加载


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
  }

}
</style>
