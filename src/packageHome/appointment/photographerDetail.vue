<template>
  <div class="photographerDetail">
    <div class="bgc"></div>
    <div class="photographer">
      <div class="photographer-main">
        <div class="photographer-main-1">
          <div class="main-1">
            <image class="avatar" :src="netConfig.picURL + '/static/my/avatar.jpg'" />
            <div class="card-1-info">
              <div class="name">钱卢骏</div>
              <div class="score">
                <up-rate :count="5" active-color="#F8C646" disabled></up-rate>
                <span class="ml-10rpx score-text">4.5分</span>
              </div>
            </div>
          </div>
          <div class="main-2">
            <div class="main-2-item">
              <div class="title">拍摄设备：</div>
              <div class="info">尼康a62 / 索尼a7m3</div>
            </div>
            <div class="main-2-item">
              <div class="title">镜头设备：</div>
              <div class="info">尼康a62 / 索尼a7m3</div>
            </div>
            <div class="main-2-item">
              <div class="title">个人简介：</div>
              <div class="info">尼康a62 / 索尼a7m3</div>
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
            <div class="my-main-basic-album" v-if="currentTab === 0">
              <div class="album" v-for="item,index in album" :key="index" v-if="album.length" @click="handlePhoto">
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
            <div class="reviews" v-if="currentTab === 1">
              <div class="review-item" v-for="(review, index) in reviews" :key="index">
                <div class="review-header">
                  <image class="reviewer-avatar" :src="review.avatar" mode="aspectFill" />
                  <div class="reviewer-info">
                    <div class="reviewer-name">{{ review.name }}</div>
                    <div class="review-date">{{ review.date }}</div>
                  </div>
                </div>
                <div class="review-content">
                  {{ review.content }}
                </div>
                <div class="review-score">
                  <up-rate :count="5" active-color="#F8C646" disabled :value="review.score"></up-rate>
                  <span class="score-text">{{ review.score }}分</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';

const currentTab = ref(0);

const switchTab = (index: number) => {
  currentTab.value = index;
};

const handlePhoto = () => {
  uni.navigateTo({ url: `/packageHome/appointment/photographerPhoto?id=1` })
  // 跳转到相册详情页
  // console.log('跳转到相册详情页');
};

const album = [
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/3.jpg', title: 'Adventure', photoNum: 7 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/1.jpg', title: 'Nature', photoNum: 4 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/7.jpg', title: 'Portraits', photoNum: 2 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/8.jpg', title: 'Sunsets', photoNum: 9 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/5.jpg', title: 'Abstract', photoNum: 1 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/6.jpg', title: 'Landscapes', photoNum: 8 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/2.jpg', title: 'Architecture', photoNum: 5 },
  { picUrl: 'https://hopai-system.oss-cn-shanghai.aliyuncs.com/static/test/4.jpg', title: 'City Life', photoNum: 3 }
];

const reviews = [
  {
    avatar: netConfig.picURL + '/static/my/avatar.jpg',
    name: '李小姐',
    date: '2023-12-29',
    content: '摄影师很专业，很负责。开始约定了时间，和摄影师沟通后给调整了',
    score: 4.5
  },
  {
    avatar: netConfig.picURL + '/static/my/avatar.jpg',
    name: '你好呀',
    date: '2023-12-29',
    content: '很方便！',
    score: 4.5
  },
  {
    avatar: netConfig.picURL + '/static/my/avatar.jpg',
    name: '明天就要嫁人啦',
    date: '2023-12-29',
    content: '选了很多家摄影的店，不是档期不符合就是收费太离谱。本来去线下约了一家，后面朋友说说他家拍的质量很差，上次还把我朋友的档期给延期了，差点没赶上婚礼。我果断退款选择合拍，前后只需要一个星期就完美出片和相册到了，而且收费也合理，原宝！',
    score: 4.5
  }
];
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