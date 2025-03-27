<template>
  <div class="photographerDetail">
    <div class="bgc"></div>
    <div class="photographer">
      <div class="photographer-main">
        <div class="photographer-main-1">
          <div class="main-1">
            <image class="avatar" :src="photographerInfo.avatar || netConfig.picURL + '/static/my/avatar.jpg'" />
            <div class="card-1-info">
              <div class="name">{{ photographerInfo.nickname || '摄影师' }}</div>
              <div class="score">
                <up-rate :count="5" active-color="#ba2636" readonly v-model="photographerInfo.rateValue"></up-rate>
                <span class="ml-10rpx score-text">{{ Number(photographerInfo.rateValue || 0).toFixed(1) }}分</span>
              </div>
            </div>
          </div>
          <div class="main-2">
            <div class="main-2-item">
              <div class="title">拍摄设备：</div>
              <div class="info">{{ photographerInfo.camera || '暂无' }}</div>
            </div>
            <div class="main-2-item">
              <div class="title">镜头设备：</div>
              <div class="info">{{ photographerInfo.zoomLens || '暂无' }}</div>
            </div>
            <div class="main-2-item">
              <div class="title">个人简介：</div>
              <div class="info">{{ photographerInfo.introduction || '暂无' }}</div>
            </div>
          </div>
        </div>
        <div class="photographer-main-2">
          <div class="main-header">
            <div class="main-header-item" @click="switchTab(0)" :class="{ active: currentTab === 0 }">
              <span>他的作品</span>
              <div class="red" v-show="currentTab === 0"></div>
            </div>
            <div class="main-header-item" @click="switchTab(1)" :class="{ active: currentTab === 1 }">
              <span>客户评价</span>
              <div class="red" v-show="currentTab === 1"></div>
            </div>
          </div>
          <div class="main-body">
            <up-skeleton :loading="loading" :rows="3" v-if="currentTab === 0">
              <div class="my-main-basic-album" v-if="currentTab === 0">
                  <EmptyState v-if="album.length === 0" :icon="netConfig.picURL + '/static/empty.svg'" text="暂无相册" />
                  <div class="album" v-for="item,index in album" :key="index" v-if="album.length" @click="handlePhoto(item.id)">
                  <image class="album-image" :src="item.picUrl || netConfig.picURL + '/static/my/gf5.jpg'" mode="aspectFill" />
                  <div class="album-desc">
                    <div class="title">{{ item.title }}</div>
                    <div class="op">
                      <span class="number">{{ item.photoNum }}</span>
                      <span class="edit">编辑</span>
                    </div>
                  </div>
                  </div>
              </div>
            </up-skeleton>
            <up-skeleton :loading="loading" :rows="3" v-if="currentTab === 1">
              <div class="reviews" v-if="currentTab === 1">
                <EmptyState v-if="reviews.length === 0" :icon="netConfig.picURL + '/static/empty.svg'" text="暂无评价" />
                <div class="review-item" v-for="(review, index) in reviews" :key="index">
                  <div class="review-header">
                    <image class="reviewer-avatar" :src="netConfig.picURL + '/static/my/avatar.jpg'" mode="aspectFill" />
                    <div class="reviewer-info">
                      <div class="reviewer-name">{{ review.nickname }}</div>
                      <div class="review-date">{{ formatDate(review.createTime) }}</div>
                    </div>
                  </div>
                  <div class="review-content">
                    {{ review.content }}
                  </div>
                  <div class="review-score">
                    <up-rate :count="5" active-color="#F8C646" readonly v-model="review.rate"></up-rate>
                    <span class="score-text">{{ review.rate }}分</span>
                  </div>
                </div>
              </div>
            </up-skeleton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import { getPhotographerUserDetail } from '@/api/home';
import { getPhotographerAlbumPage } from '@/api/home/album';
import { getPhotoUrl } from '@/api/home/photo';
import EmptyState from '@/components/common/EmptyState.vue';
const currentTab = ref(0);
const userId = ref('');
const photographerInfo = ref<any>({});
const album = ref<any[]>([]);
const pageNo = ref(1);
const pageSize = ref(10);
const loading = ref(false);

onLoad(async (options: any) => {
  if (options.userId) {
    userId.value = options.userId;
    try {
      loading.value = true;
      const res = await getPhotographerUserDetail(userId.value);
      photographerInfo.value = res.data;
      // 获取摄影师相册数据
      const albumRes = await getPhotographerAlbumPage({
        pageNo: pageNo.value,
        pageSize: pageSize.value,
        userId: userId.value
      });
      const list = albumRes.data.list || [];
      // 获取每个相册的封面图片URL
      const albumWithUrls = await Promise.all(list.map(async (item: any) => {
        if (item.coverPhotoId) {
          const photoRes = await getPhotoUrl(item.coverPhotoId);
          return { ...item, picUrl: photoRes.data.url };
        }
        return item;
      }));
      album.value = albumWithUrls;
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      loading.value = false;
    }
  }
});

const switchTab = (index: number) => {
  currentTab.value = index;
};

const handlePhoto = (albumId: string) => {
  uni.navigateTo({ url: `/packageHome/appointment/photographerPhoto?id=${albumId}` })
};


import { getPhotographerEvaluatePage } from '@/api/home';

const reviews = ref<any[]>([]);
const evaluatePageNo = ref(1);
const evaluatePageSize = ref(100);
const hasLoadedReviews = ref(false);

const fetchReviews = async () => {
  try {
    loading.value = true;
    const res = await getPhotographerEvaluatePage(
evaluatePageNo.value,
evaluatePageSize.value,
  userId.value);
    reviews.value = res.data.list || [];
    hasLoadedReviews.value = true;
  } catch (error) {
    console.error('获取评价数据失败:', error);
  } finally {
    loading.value = false;
  }
};

watch(currentTab, (newVal) => {
  if (newVal === 1 && !hasLoadedReviews.value) {
    fetchReviews();
  }
});

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
</script>

<style lang="scss" scoped>
.photographerDetail {
  width: 100vw;
  background-color: #f6f6f6;

  .blank {
    width: 100vw;
  }

  .bgc {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 460rpx;
    background-image: url('https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/client/static/home/photographer.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .photographer {
    padding: 360rpx 32rpx 32rpx;
    position: relative;

    &-main {
      background-color: #f6f6f6;
      border-radius: 12rpx;
      &-1 {
        border-radius: 12rpx;
        width: calc(100vw - 64rpx);
        background-color: #fff;
        box-sizing: border-box;
        padding: 32rpx;
        padding-top: 48rpx;
        margin-bottom: 60rpx;

        .main-1 {
          display: flex;
          margin-bottom: 24rpx;
          .avatar {
            border-radius: 50%;
            width: 90rpx;
            height: 90rpx;
            margin-right: 20rpx;
          }

          .card-1-info {
            display: flex;
            flex-direction: column;
            .name {
              font-size: 34rpx;
              font-weight: 400;
            }
            .score {
              display: flex;
              align-items: center;
              &-text {
                font-size: 24rpx;
              }
            }
          }
        }

        .main-2 {
          display: flex;
          flex-direction: column;
          padding-bottom: 40rpx;

          &-item {
            display: flex;
            flex-direction: column;
            font-size: 28rpx;
            margin-bottom: 24rpx;
            .info {
              color: rgba(40, 40, 40, 0.50);
            }
          }
        }
      }

      &-2 {
        width: calc(100vw - 64rpx);
        background-color: #f6f6f6;
        
        .main-header {
          display: flex;
          justify-content: space-around;
          margin-bottom: 40rpx;
          &-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 32rpx;
            position: relative;
            cursor: pointer;

            .red {
              position: absolute;
              bottom: -10rpx;
              left: 20%;
              width: 60%;
              background-color: #ba2636;
              height: 4rpx;
              transition: opacity 0.3s ease;
            }

            &.active {
              color: #ba2636;
            }
          }
        }

        .main-body {
          .my-main-basic-album {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;

            .album {
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              border-radius: 16rpx;
              width: 320rpx;
              height: 564rpx;
              padding: 24rpx;
              background-color: #fff;
              margin-bottom: 32rpx;

              &-image {
                width: 272rpx;
                height: 388rpx;
                border-radius: 12rpx;
                margin-bottom: 24rpx;
              }

              .title {
                margin-bottom: 24rpx;
                font-weight: 400;
                font-size: 28rpx;
              }

              .op {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .number {
                  color: rgba(0, 0, 0, 0.30);
                }

                .edit {
                  font-size: 24rpx;
                  color: #ba2636;
                }
              }
            }

            .album-empty {
              display: flex;
              width: 100%;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin-bottom: 40rpx;

              .title {
                color: rgba(0,0,0,0.3);
                font-size: 28rpx;
              }
            }
          }

          .reviews {
            padding: 0 20rpx;
            .review-item {
              background: #fff;
              border-radius: 12rpx;
              padding: 24rpx;
              margin-bottom: 24rpx;

              .review-header {
                display: flex;
                align-items: center;
                margin-bottom: 16rpx;

                .reviewer-avatar {
                  width: 80rpx;
                  height: 80rpx;
                  border-radius: 50%;
                  margin-right: 16rpx;
                }

                .reviewer-info {
                  .reviewer-name {
                    font-size: 28rpx;
                    font-weight: 500;
                    margin-bottom: 4rpx;
                  }

                  .review-date {
                    font-size: 24rpx;
                    color: rgba(0, 0, 0, 0.5);
                  }
                }
              }

              .review-content {
                font-size: 28rpx;
                line-height: 1.5;
                margin-bottom: 16rpx;
              }

              .review-score {
                display: flex;
                align-items: center;

                .score-text {
                  margin-left: 12rpx;
                  font-size: 24rpx;
                  color: #F8C646;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

import EmptyState from '@/components/common/EmptyState.vue';
