<template>
  <div class="album w-100vw h-100vh flex">
    <scroll-view class="album-tab-scrollview" scroll-x="true">
      <div class="album-tab">
        <up-tabs
          :list="tabList"
          v-model:current="active"
          @change="handleClick"
          lineColor="#ba2636"
          :activeStyle="{
            color: '#ba2636',
            fontWeight: 'bold',
            transform: 'scale(1.05)',
          }"
        />
      </div>
    </scroll-view>
    <scroll-view class="album-main-scrollview" scroll-y="true">
      <div class="album-main">
        <!-- 这里必须叠一层 -->
        <div class="album-main-layout">
          <up-skeleton :rows="3" :loading="loading">
            <div class="album-main-layout-flex">
              <EmptyState v-if="album.length === 0" :icon="netConfig.picURL + '/static/empty.svg'" text="当前没有相册" />
              <div class="album-item" v-else @click="handlePhoto(item)" v-for="(item, index) in album" :key="item.id">
                <image :src="item.backgroundUrl" class="album-item-image" mode="aspectFill" />
                <div class="album-item-title">{{ item.name }}</div>
                <div class="album-item-desc">
                  <span style="font-size: 36rpx">{{ item.number || 0 }}</span>
                  <span>{{ new Date(item.createTime).getFullYear() + '.' + (new Date(item.createTime).getMonth() + 1) + '.' + new Date(item.createTime).getDate() }}</span>
                </div>
              </div>
            </div>
          </up-skeleton>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script setup lang="ts">
  import { netConfig } from '@/config/net.config';
  import { getAlbumPage } from '@/api/album/index';
  import { getCategoryTree } from '@/api/home';
  import EmptyState from '@/components/common/EmptyState.vue';
  const loading = ref(false);
  const album = ref<any>([]);
  const pageNo = ref(1);
  const tabList = ref([{ name: '全部', path: '/', categoryId: null }]);
  const active = ref(0);

  const getData = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      const resTree = await getCategoryTree();
      // 更新tabList，保留第一个"全部"选项
      if (resTree.data?.length) {
        const categoryTabs = resTree.data.map((item: any) => ({
          name: item.name,
          path: '/my',
          categoryId: item.id,
        }));
        tabList.value = [tabList.value[0], ...categoryTabs];
      }
      const params = {
        pageNo: pageNo.value,
        pageSize: 100,
        categoryId: tabList.value[active.value].categoryId,
      };
      const res = await getAlbumPage(params);
      const list = res.data?.list || [];
      album.value = list.map((item: any) => {
        if (item?.backgroundUrl && item.backgroundUrl.startsWith('https://hopai-workspace.oss-cn-shanghai.aliyuncs.com')) {
          item.backgroundUrl = item.backgroundUrl + '/minipreview';
        }
        return item;
      });
    } finally {
      loading.value = false;
    }
  };
  const handleClick = () => {
    // active.value = index;
    pageNo.value = 1;
    album.value = [];
    getData();
  };

  const handlePhoto = (item: any) => {
    uni.navigateTo({
      url: `/packageAlbum/photo/index?id=${item.id}&orderId=${item.orderId}`,
    });
  };

  onLoad(async () => {
    pageNo.value = 1;
    album.value = [];
    await getData();
  });

  onPullDownRefresh(async () => {
    pageNo.value = 1;
    album.value = [];
    await getData();
    uni.stopPullDownRefresh();
  });
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
      // 确保 album 占据整个视
      width: 100vw;
      height: calc(100vh - 140rpx);
      background-color: #f6f6f6;
      white-space: nowrap;
    }
    .album-main {
      background-color: #f6f6f6;
      &-layout {
        padding: 32rpx;
        box-sizing: border-box;
        width: 100%;
        &-flex {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          flex-grow: 1;
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
              color: rgba(0, 0, 0, 0.3);
            }
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
