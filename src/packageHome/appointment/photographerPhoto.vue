<template>
  <div class="album">
    <div class="album-name">
      <div class="album-name-header">
        <span>作品集名称</span>
      </div>
      <up-skeleton :rows="3" :loading="loading">
        <div class="album-name-content" v-if="album">
          <span>{{ album.title ? album.title : '无标题' }}</span>
        </div>
      </up-skeleton>
    </div>
    <div class="album-photo">
      <div class="album-photo-header">
        <div class="title">作品集</div>
      </div>
      <up-skeleton :rows="6" :loading="loading">
        <div class="album-photo-main">
          <div v-for="item,index in photo" :key="index" class="album-photo-main-item" @click="previewPhoto(item.url)">
            <image :src="item.url" class="photo" mode="aspectFill" fade-show="true" />
          </div>
        </div>
      </up-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPhotoPage } from '@/api/home/photo'
import { getPhotographerAlbumDetail } from '@/api/home/album'
const photo = ref<any>([])
const album = ref()
const loading = ref(false)
const id = ref()

const previewPhoto = (picUrl: string) => {
  const urls = photo.value.map((item: any) => item.url)
  uni.previewImage({
    urls,
    current: picUrl
  })
}

const getData = async () => {
  loading.value = true
  try {
    const albumRes = await getPhotographerAlbumDetail(id.value)
    album.value = albumRes.data
    const photoRes = await getPhotoPage(1,100,id.value)
    photo.value = photoRes.data.list.map((item: any) => ({
      url: item.url
    }))
  } finally {
    loading.value = false
  }
}

onLoad(async (options: any) => {
  id.value = options.id
  await getData()
})
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  margin-top: 28rpx;
  padding: 54rpx;

  .title {
    font-size: 36rpx;
    font-weight: 500;
    margin-bottom: 49rpx;
  }

  .desc {
    background-color: #f6f6f6;
    font-size: 28rpx;
    padding: 32rpx 32rpx;
    border-radius: 32rpx;
    color: rgba(40, 40, 40, 0.5);
    word-wrap: break-word;
  }

  .btn-group {
    display: flex;
    justify-content: space-around;
    margin-top: 49rpx;
    padding: 0rpx 96rpx;

    .btn {
      font-size: 32rpx;
      padding: 0 96rpx;
      border-radius: 32rpx;

      &-accept {
        color: #fff;
        background-color: #ba2636;
      }
    }
  }
}
.popup-progress {
  width: 500rpx;
  border-radius: 32rpx;
  padding: 32rpx;
}
.album {
  box-sizing: border-box;
  width: 100vw;
  min-height: 100vh;
  background-color: #f6f6f6;
  padding: 32rpx;

  &-name {
    margin-bottom: 66rpx;
    font-weight: 200;

    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32rpx;

      .btn-del {
        font-weight: 400;
        padding: 8rpx 16rpx;
        border-radius: 12rpx;
        border: 2rpx solid #ba2636;
        color: #ba2636;
        font-size: 24rpx;
      }
    }

    &-content {
      background-color: #fff;
      padding: 32rpx;
      border-radius: 12rpx;
    }
  }

  &-photo {
    &-header {
      display: flex;
      justify-content: space-between;
      margin-top: 32rpx;

      .title {
        font-weight: 200;
      }
      .btn {
        display: flex;

        &-add {
          padding: 8rpx 16rpx;
          border-radius: 12rpx;
          border: 2rpx solid #ba2636;
          color: #ba2636;
          font-size: 24rpx;
        }
      }
    }

    &-main {
      display: flex;
      width: 100%;
      margin-top: 36rpx;
      flex-wrap: wrap;

      &-item {
        position: relative;
        width: 210rpx;
        height: 280rpx;
        border-radius: 12rpx;
        margin-bottom: 28rpx;
        margin-right: 20rpx;

      }
      
      .photo {
        width: 210rpx;
        height: 280rpx;
        border-radius: 12rpx;
      }

      .delete {
        z-index: 1;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 7rpx; 
        left: 6rpx;
        width: 35rpx;
        height: 35rpx;
        background-color: #e1dede;
        border-radius: 50%;
        &-icon {
          width: 15rpx;
          background-color: #ba2636;
          height: 1rpx;
        }
      }

      .add {
        z-index: 1;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 7rpx; 
        right: 6rpx;
        width: 35rpx;
        height: 35rpx;
        background-color: #e1dede;
        border-radius: 50%;
        &-icon {
          font-size: 32rpx;
          color: #ba2636;
        }
}

    }
  }
}
</style>