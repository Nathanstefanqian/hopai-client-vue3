<template>
  <div class="album w-100vw h-100vh flex">
    <scroll-view class="album-tab-scrollview" scroll-x="true">
      <div class="album-tab">
        <div class="tab" v-for="item,index in tabList" :key="index" @click="handleClick(index)">
          <span class="mb-[10rpx]" :style="active === index ? { color: '#ba2636' } : {}">{{ item.name }}</span>
          <div class="svg-icon" v-if="active === index"></div>
        </div>
      </div>
    </scroll-view>
    <scroll-view class="album-main-scrollview" scroll-y="true">
      <div class="album-main">
        <!-- 这里必须叠一层 -->
        <div class="album-main-layout"> 
          <div class="album-item" @click="handlePhoto(item)" v-for="item, index in [1,2,3,4,5,6,8,9,10]" :key="index">
            <image :src="netConfig.picURL + '/static/album/demo.JPG'" class="album-item-image" mode="aspectFill" />
            <div class="album-item-title">个人写真</div>
            <div class="album-item-desc">
              <span style="font-size: 36rpx;">25</span>
              <span>2023-08-28</span>
            </div>
          </div>
        </div>
      </div>
    </scroll-view>

  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config'
import { getAlbumPage } from '@/api/album/index'
const loading = ref(false)
const album = ref([])
const tabList = ref([
  { name: '全部', path: '/' },
  { name: '幸福拍', path: '/discover' },
  { name: '家庭拍', path: '/my' },
  { name: '公司拍', path: '/my' },
  { name: '随心拍', path: '/my' }
])
const active = ref(0);
const handleClick = (index: number) => {
  active.value = index;
}

const handlePhoto = () => {
  uni.navigateTo({
    url: '/packageAlbum/photo/index'
  })
}

const getData = async () => {
  loading.value = true
  try {
    album.value= (await getAlbumPage({ pageNo:1 , pageSize: 50 })).data?.list || []
    // await Promise.all(album.value.map(async item => {
    //   item.picUrl = (await getPhoto(item.coverPhotoId)).data.url || ''
    // }))
  } finally {
    loading.value = false
  }
}

onShow(async () => {
  await getData()
})

</script>

<style lang="scss" scoped>
.album-tab-scrollview {
  width: 100%;
  white-space: nowrap;
}
.album {
  display: flex;
  flex-direction: column;

  .album-tab {
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
.album-main-scrollview {
  height: calc(100vh - 140rpx); // 确保 album 占据整个视
  white-space: nowrap;
}
  .album-main {
    background-color: #f6f6f6;
    &-layout {
      display: flex;
      padding: 32rpx;
      height: 100%;
      box-sizing: border-box;
      flex-wrap: wrap;
      width: 100%;
      flex-grow: 1;
      justify-content: space-between;
      .album-item {
      width: 328rpx;
      height: 564rpx;
      border-radius: 16rpx;
      background-color: #fff;
      margin-bottom: 32rpx;
      padding: 32rpx;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      
      &-image {
        width: 100%;
        border-radius: 16rpx;
        margin-bottom: 16rpx;
      }
      &-title {
        margin-bottom: 16rpx;
      }
      &-desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(0, 0, 0, 0.30);
      }
    }
    }

  }

}

</style>