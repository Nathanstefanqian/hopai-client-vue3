<template>
  <div class="review">
    <div class="review-item">
      <div class="review-item-header">服务评分</div>
      <div class="review-item-stars">
        <up-rate v-model="formData.rating" :count="5" size="48" void-color="#ddd" />
      </div>
    </div>
    <div class="review-item">
      <div class="review-item-header">评价内容</div>
      <textarea
        v-model="formData.content"
        class="review-item-input"
        placeholder="请输入您的评价内容（200字以内）"
        maxlength="200"
      ></textarea>
      <div class="content-count">{{ formData.content.length }}/200</div>
    </div>
    <div class="review-item">
      <div class="review-item-header">匿名评价</div>
      <div class="review-item-switch">
        <up-switch v-model="isAnonymous" activeColor="#ba2636" />
        <span class="switch-text">{{ isAnonymous ? '匿名评价' : '实名评价' }}</span>
      </div>
    </div>
    <div class="review-footer">
      <div class="btn" @click="handleSubmit">提交评价</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createEvaluation } from '@/api/order/index';
import { useUserStore } from '@/pinia/user';

const userStore = useUserStore();
const isAnonymous = ref(false);

const formData = reactive({
  rating: 5,
  content: '',
  orderId: ''
});

// 获取页面参数
onLoad((options: any) => {
  if (options.orderId) {
    formData.orderId = options.orderId;
  }
});

// 提交评价
const handleSubmit = async () => {
  if (formData.content.trim().length === 0) {
    uni.showToast({
      title: '请输入评价内容',
      icon: 'none'
    });
    return;
  }

  try {
    const nickname = isAnonymous.value ? '和拍用户' : uni.getStorageSync('nickname');
    await createEvaluation({
      userId: userStore.userInfo?.userId || '',
      nickname,
      content: formData.content,
      orderId: formData.orderId,
      rate: formData.rating
    });
    
    uni.showToast({
      title: '评价成功',
      icon: 'success'
    });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    uni.showToast({
      title: '评价失败，请重试',
      icon: 'none'
    });
  }
};
</script>

<style lang="scss" scoped>
.review {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  background-color: #f6f6f6;

  &-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 48rpx;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 16rpx;

    .rating-container {
      display: flex;
      justify-content: center;
      gap: 32rpx;
    }

    .rating-item {
      cursor: pointer;
    }

    .rating-icon {
      width: 48rpx;
      height: 48rpx;
    }

    &-header {
      font-size: 32rpx;
      font-weight: 500;
      margin-bottom: 24rpx;
    }

    &-stars {
      display: flex;
      justify-content: center;
      margin: 20rpx 0;
    }

    &-switch {
      display: flex;
      align-items: center;
      gap: 20rpx;

      .switch-text {
        font-size: 28rpx;
        color: #282828;
      }
    }

    &-input {
      width: 100%;
      height: 300rpx;
      padding: 20rpx;
      font-size: 28rpx;
      color: #282828;
      border: 1rpx solid rgba(0, 0, 0, 0.10);
      border-radius: 12rpx;
      box-sizing: border-box;

      &::placeholder {
        color: rgba(40, 40, 40, 0.30);
      }
    }
  }

  .content-count {
    text-align: right;
    font-size: 24rpx;
    color: rgba(40, 40, 40, 0.50);
    margin-top: 12rpx;
  }

  &-footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 32rpx;
    background-color: #fff;
    box-sizing: border-box;

    .btn {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: #000;
      color: #fff;
      border-radius: 12rpx;
      font-size: 32rpx;
    }
  }
}
</style>