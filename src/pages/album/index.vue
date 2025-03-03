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
    <up-skeleton :rows="3" :loading="loading">
      <scroll-view class="album-main-scrollview" scroll-y="true" @scrolltolower="handleLoadMore">
      <div class="album-main">
        <!-- 这里必须叠一层 -->
        <div class="album-main-layout"> 
          <div class="album-item" @click="handlePhoto(item)" v-for="item, index in album" :key="item.id">
            <image :src="item.backgroundUrl" class="album-item-image" mode="aspectFill" />
            <div class="album-item-title">{{ item.name }}</div>
            <div class="album-item-desc">
              <span style="font-size: 36rpx;">{{ item.number || 0 }}</span>
              <span>{{ new Date(item.createTime).getFullYear() + '.' + (new Date(item.createTime).getMonth() + 1) + '.' + new Date(item.createTime).getDate() }}</span>
            </div>
          </div>
        </div>
        <div class="load-more" v-if="hasMore || loading">
          {{ loading ? '加载中...' : hasMore ? '上拉加载更多' : '没有更多了' }}
        </div>
      </div>
    </scroll-view>
    </up-skeleton>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config'
import { getAlbumPage } from '@/api/album/index'
const loading = ref(false)
const album = ref<any>([])
const pageNo = ref(1)
const hasMore = ref(true)
const tabList = ref([
  { name: '全部', path: '/', categoryId: null },
  { name: '幸福拍', path: '/discover', categoryId: 7 },
  { name: '家庭拍', path: '/my', categoryId: 13 },
  { name: '公司拍', path: '/my', categoryId: 50 },
  { name: '随心拍', path: '/my', categoryId: 1 }
])
const active = ref(0);
const handleClick = (index: number) => {
  active.value = index;
  pageNo.value = 1;
  album.value = [];
  hasMore.value = true;
  getData();
}

const getData = async () => {
  if (loading.value || !hasMore.value) return;
  loading.value = true
  try {
    const params = {
      pageNo: pageNo.value,
      pageSize: 10,
      categoryId: tabList.value[active.value].categoryId
    }
    const res = await getAlbumPage(params)
    const list = res.data?.list || []
    if (list.length < params.pageSize) {
      hasMore.value = false
    }
    album.value = [...album.value, ...list]
    pageNo.value++
  } finally {
    loading.value = false
  }
}

const handleLoadMore = () => {
  getData()
}

const handlePhoto = (item: any) => {
  uni.navigateTo({
    url: `/packageAlbum/photo/index?id=${item.id}&orderId=${item.orderId}`
  })
}

onShow(async () => {
  pageNo.value = 1;
  album.value = [];
  hasMore.value = true;
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

.load-more {
  text-align: center;
  padding: 20rpx 0;
  color: #999;
  font-size: 24rpx;
}
</style>