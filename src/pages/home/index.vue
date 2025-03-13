<template>
  <div class="h-648rpx w-100vw relative">
    <div class="home">
      <div class="home-location">
        <area-picker v-model="selectedArea" class="flex items-center">
          <template #default="{ selectedAreaText }">
            <span class="mr-10rpx">{{ selectedAreaText || '南通' }}</span>
            <image :src="netConfig.picURL + '/static/home/location.svg'" class="w-20rpx h-20rpx" />
          </template>
        </area-picker>
      </div>
      <up-swiper :list="list1" indicatorMode="dot" indicator circular height="900rpx" :loading="loading"></up-swiper>
      <div class="home-main">
        <div class="home-main-item" v-for="(category, index) in categories" :key="index">
          <div class="home-main-item-header">
            <div class="left">{{ category.name }}</div>
            <div class="right" @click="handleSku(index)">全部</div>
          </div>
          <scroll-view class="home-main-item-scrollview" scroll-x="true">
            <div class="home-main-item-body">
              <div class="card" v-for="(item, productIndex) in categories[index].children || []" :key="productIndex" @click="handleSpu(item.id)">
                <div class="card-top">
                  <image :src="item.picUrl" class="w-280rpx h-400rpx card-top-image" mode="aspectFill" /> 
                  <div class="tag">{{ item.name }}</div>
                </div>
                <div class="card-bottom">
                  <span class="title">{{ item.name }}</span>
                  <span class="price">{{ item.priceInfo }}</span>
                </div>
              </div>
            </div>
          </scroll-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import { getCarousel, getProductSpuPage, getCategoryTree } from '@/api/home';
import AreaPicker from '@/components/home/AreaPicker.vue';

const loading = ref(true);
const list1 = ref<string[]>([]);
const categories = ref<any[]>([]);
const categoryProducts = ref<Record<number, any[]>>({});
const selectedArea = ref({ areaId: null, areaName: '南通' });

const handleSpu = (item: any) => {
  uni.navigateTo({
    url: `/packageHome/spu/index?id=${item}`
  })
}

const handleSku = (categoryId: number) => {
  uni.navigateTo({
    url: `/packageHome/sku/index?categoryId=${categoryId}`
  })
}

const getBanners = async () => {
  try {
    loading.value = true;
    const res = await getCarousel();
    if (res.data) {
      list1.value = res.data.map((item: any) => item.imageUrl);
    }
  } catch (error) {
    console.error('获取轮播图失败:', error);
  } finally {
    loading.value = false;
  }
}

const getProductsByCategory = async (categoryId: number) => {
  try {
    const res = await getProductSpuPage({
      pageNo: 1,
      pageSize: 10,
      categoryId
    });
    if (res.data?.list) {
      categoryProducts.value[categoryId] = res.data.list;
    }
  } catch (error) {
    console.error(`获取分类${categoryId}商品列表失败:`, error);
  }
}

onMounted(async () => {
  await getBanners();
  try {
    const res = await getCategoryTree();
    if (res.data && res.data.length > 0 && res.data[0].children) {
      categories.value = res.data;
    }
  } catch (error) {
    console.error('获取分类数据失败:', error);
  }
});
</script>

<style lang="scss" scoped>
.home {
  position: relative;

  &-location {
    position: absolute;
    z-index: 1;
    top: 100rpx;
    left: 14rpx;
    height: 40rpx;
    font-weight: 500;
    border-radius: 16rpx;
    font-size: 32rpx;
    padding: 32rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &-main {
    display: flex;
    padding: 32rpx;
    width: 100vw;
    box-sizing: border-box;
    min-height: 100vh;
    background-color: #f6f6f6;
    flex-direction: column;

    &-item {
      margin-top: 40rpx;
      width: 100%;
      margin-bottom: 60rpx;

      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        .left {
          font-weight: 400;
        }
        .right {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20rpx;
          color: #ba2636;
          border: 2rpx solid #ba2636;
          padding: 4rpx 16rpx;
          border-radius: 12rpx;
        }
      }

      .home-main-item-scrollview {
        width: 100%;
        white-space: nowrap;
      }

      &-body {
        display: flex;
        width: 100%;
        .card {
          min-width: 280rpx;
          margin-right: 40rpx;
          &-top {
            position: relative;
            margin-bottom: 10rpx;
            &-image {
              border-radius: 12rpx;
            }
            .tag {
              position: absolute;
              z-index: 0;
              top: 10rpx;
              padding: 8rpx;
              font-size: 24rpx;
              background-color:rgba(249, 233, 132, 0.90);
              border-radius: 8rpx;
            }
          }
          &-bottom {
            display: flex;
            flex-direction: column;

            .title {
              font-size: 28rpx;
              margin-bottom: 10rpx;
            }

            .price {
              color: #ba2636;
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }
}
</style>