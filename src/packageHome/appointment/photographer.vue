<template>
  <div class="photographer">
    <div class="photographer-header">
      <div class="left">选择摄影师</div>
      <div class="right">共 {{ photographerList.length }} 位摄影师</div>
    </div>
    <div class="photographer-tag">
      <div class="photographer-tag-item" :class="{ active: currentLevel === 'newbee' }" @click="handleLevel('newbee')">
        <image :src="netConfig.picURL + '/static/home/' + (currentLevel === 'newbee' ? 'hopai-newbee-active.svg' : 'hopai-newbee.svg')" class="tag" />
        <span>摄影新秀</span>
      </div>
      <div class="photographer-tag-item" :class="{ active: currentLevel === 'expert' }" @click="handleLevel('expert')">
        <image :src="netConfig.picURL + '/static/home/' + (currentLevel === 'expert' ? 'hopai-normal-active.svg' : 'hopai-normal.svg')" class="tag" />
        <span>摄影专家</span>
      </div>
      <div class="photographer-tag-item" :class="{ active: currentLevel === 'master' }" @click="handleLevel('master')">
        <image :src="netConfig.picURL + '/static/home/' + (currentLevel === 'master' ? 'hopai-master-active.svg' : 'hopai-master.svg')" class="tag" />
        <span>摄影大师</span>
      </div>
    </div>
    <div class="photographer-main">
      <scroll-view class="photographer-main-scroll-view" scroll-y="true">
        <up-skeleton :loading="loading" :rows="3">
          <EmptyState v-if="photographerList.length === 0" :icon="netConfig.picURL + '/static/home/empty-photographer.svg'" text="暂无可用摄影师" />
          <div class="photographer-main-card" v-for="(item, index) in photographerList" :key="item.userId" @click="handleSelectPhotographer(item.userId, index)" :class="{ 'selected': selectedPhotographer === item.userId }">
            <div class="card">
              <div class="card-1">
                <div class="left">
                  <image class="avatar" :src="item.avatar || netConfig.picURL + '/static/my/avatar.jpg'" />
                  <div class="card-1-info">
                    <div class="name">{{ item.nickname || '未设置昵称' }}</div>
                    <div class="score">
                      <up-rate active-color="#ba2636" v-model="item.rateValue" readonly allowHalf></up-rate>
                      <span class="ml-10rpx score-text">{{ Number(item.rateValue || 0).toFixed(1) }}分</span>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <up-checkbox usedAlone shape="circle" activeColor="#ba2636" v-model:checked="item.isChecked" @change="handleCheckboxChange(item.isChecked, item.userId)"/>
                </div>
              </div>
              <div class="card-2">
                <div>
                  <span>拍摄设备：</span>
                  <span>{{ item.camera || '暂无' }}</span>
                </div>
                <div>
                  <span>拍摄镜头：</span>
                  <span>{{ item.zoomLens || '暂无' }}</span>
                </div>
              </div>
              <div class="card-3">
                <div class="left">
                  <span>约拍价</span>
                  <span class="price">
                    <span style="font-size: 32rpx"> ￥ </span> {{ item.price || '待定' }}</span>
                </div>
                <div class="right" @click="handleDetail(item.userId)">
                  TA的主页
                </div>
              </div>
            </div>
          </div>
        </up-skeleton>
      </scroll-view>
    </div>
    <div class="photographer-footer">
      <div class="photographer-footer-btn mr-20rpx" @click="handlePre">上一步</div>
      <div class="photographer-footer-btn btn" @click="handleNext">下一步</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { netConfig } from '@/config/net.config';
import EmptyState from '@/components/common/EmptyState.vue';
import { getPhotographerUser } from '@/api/home'
const currentLevel = ref('newbee')
const photographerList = ref([] as any)
const loading = ref(false)

// 获取摄影师列表
const getPhotographerList = async (levelId: number = 1) => {
  const categoryId = uni.getStorageSync('selectedCategoryId')
  const areaCode = uni.getStorageSync('selectedAreaCode')
  const selectedSpu = uni.getStorageSync('selectedSpu')
  if (categoryId && areaCode) {
    try {
      loading.value = true
      const res = await getPhotographerUser({ categoryId, areaId: areaCode, levelId })
      photographerList.value = res.data.map((item: any) => {
        // 根据等级获取对应的价格
        let price: any = 0
        if (selectedSpu && selectedSpu.skus && selectedSpu.skus.length > 0) {
          const skuIndex = levelId - 1
          if (skuIndex >= 0 && skuIndex < selectedSpu.skus.length) {
            price = (selectedSpu.skus[skuIndex].price / 100).toFixed(2)
          }
        }
        return {
          ...item,
          isChecked: false,
          price: price
        }
      })
    } catch (error) {
      console.error('获取摄影师列表失败:', error)
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  getPhotographerList()
})

const handleLevel = (level: string) => {
  currentLevel.value = level
  const levelMap = {
    newbee: 1,
    expert: 2,
    master: 3
  }
getPhotographerList(levelMap[level as keyof typeof levelMap])
}
const handlePre = () => {
  uni.navigateBack()
}

const selectedPhotographer = ref('');

const handleSelectPhotographer = (userId: string, index: number) => {
  // 如果点击已选中的摄影师，则取消选中
  if (selectedPhotographer.value === userId) {
    photographerList.value[index].isChecked = false;
    selectedPhotographer.value = '';
    return;
  }
  // 取消之前选中的摄影师
  photographerList.value.forEach((item: any) => {
    item.isChecked = false;
  });
  // 选中当前摄影师
  photographerList.value[index].isChecked = true;
  selectedPhotographer.value = userId;
  // 更新摄影师的价格
  const selectedSpu = uni.getStorageSync('selectedSpu');
  if (selectedSpu && selectedSpu.skus && selectedSpu.skus.length > 0) {
    const levelMap = {
      newbee: 0,
      expert: 1,
      master: 2
    };
    const skuIndex: any = levelMap[currentLevel.value];
    if (skuIndex >= 0 && skuIndex < selectedSpu.skus.length) {
      photographerList.value[index].price = (selectedSpu.skus[skuIndex].price / 100).toFixed(2);
    }
  }
};

const handleCheckboxChange = (checked: boolean, userId: string) => {
  // 更新选中的摄影师
  if (!checked) {
    // 取消其他摄影师的选中状态
    photographerList.value.forEach((item: any) => {
      item.isChecked = item.userId === userId;
    });
    selectedPhotographer.value = userId;
  } else {
    selectedPhotographer.value = '';
  }
};

const handleNext = () => {
  if (!selectedPhotographer.value) {
    uni.showToast({
      title: '请选择摄影师',
      icon: 'none'
    });
    return;
  }
  // 使用当前页面选中的摄影师信息
  const photographer = photographerList.value.find((item: any) => item.userId === selectedPhotographer.value);
  if (!photographer) {
    uni.showToast({
      title: '摄影师信息获取失败',
      icon: 'none'
    });
    return;
  }
  // 更新storage中的摄影师信息
  uni.setStorageSync('selectedPhotographer', photographer);
  uni.navigateTo({
    url: '/packageHome/appointment/confirm'
  });
};

const handleDetail = (userId: string) => {
  uni.navigateTo({
    url: `/packageHome/appointment/photographerDetail?userId=${userId}`
  })
}

// 移除了复杂的计算属性，使用更直接的绑定方式
</script>

<style lang="scss" scoped>
.photographer-main-scroll-view {
  width: 100%;
  white-space: nowrap;
}

.photographer {
  width: 100vw;
  height: 100vh;

  &-header {
    display: flex;
    justify-content: space-between;
    padding: 32rpx;
    background-color: #fff;

    .left {
    }

    .right {
      font-size: 28rpx;
      color: rgba(40, 40, 40, 0.50);
    }
  }

  &-tag {
    display: flex;
    padding: 16rpx 32rpx 32rpx 32rpx;
    height: 80rpx;
    background-color: #fff;
    justify-content: space-between;

    &-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      box-sizing: border-box;
      padding: 0 16rpx;
      width: 200rpx;
      height: 80rpx;
      border-radius: 12rpx;
      border: 1rpx solid rgba(40, 40, 40, 0.50);
      font-size: 28rpx;
      transition: all 0.3s ease;
      cursor: pointer;

      &.active {
        border-color: #ba2636;
        color: #ba2636;
      }
    }

    .tag {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
      transition: filter 0.3s ease;
    }
  }

  &-main {
    display: flex;
    width: 100vw;
    box-sizing: border-box;
    height: calc(100vh - 408rpx);
    padding: 32rpx;
    padding-bottom: 0;
    background-color: #f6f6f6;

    &-card {
      display: flex;

      .card {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 12rpx;
        box-sizing: border-box;
        padding: 32rpx;
        background-color: #fff;
        margin-bottom: 40rpx;

        &-1 {
          display: flex;
          margin-bottom: 20rpx;
          justify-content: space-between;
          .left {
            display: flex;
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

        }

        &-2 {
          display: flex;
          flex-direction: column;
          font-size: 28rpx;
          color: rgba(40,40,40,1);
          margin-bottom: 20rpx;
        }

        &-3 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 12rpx;
          .left {
            font-size: 28rpx;
            .price {
               font-size: 56rpx;
               color: #ba2636;
            }
          }
          .right {
            padding: 8rpx 32rpx;
            border-radius: 12rpx;
            font-size: 28rpx;
            border: 1rpx solid rgba(0,0,0,0.55);
          }
        }

      }
    }
  }

  &-footer {
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: 0;
    display: flex;
    padding: 32rpx 64rpx 64rpx 64rpx;
    box-sizing: border-box;
    height: 180rpx;
    background-color: #fff;
    border-top: 1rpx solid rgba(40, 40,40,0.1);
    &-btn {
      width: 300rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
      border: 1rpx solid #282828;
    }
    .btn {
      color: #fff;
      background-color: #282828;
    }
  }
  
}
.photographer-main-card {
  display: flex;
  transition: all 0.3s ease-in-out;
  margin-top: 10rpx;
  &.selected .card {
    border: 2rpx solid #ba2636;
    box-shadow: 0 4rpx 12rpx rgba(186, 38, 54, 0.2);
    transform: translateY(-4rpx);
    transition: all 0.3s ease-in-out;
  }
}
</style>

