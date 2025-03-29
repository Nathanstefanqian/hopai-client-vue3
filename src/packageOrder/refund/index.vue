<template>
  <div class="refund">
    <div class="refund-item">
      <div class="refund-item-header">
        <span class="required">*</span>退款原因
      </div>
      <div class="refund-item-content" @click="showPicker = true">
        <div class="selector">{{ formData.reason || '点击选择退款原因' }}</div>
      </div>
    </div>
    <div class="refund-item">
      <div class="refund-item-header">退款描述</div>
      <textarea
        v-model="formData.reasonInfo"
        class="refund-item-input"
        placeholder="请输入退款描述（200字以内）"
        maxlength="200"
      ></textarea>
      <div class="content-count">{{ formData.reasonInfo.length }}/200</div>
    </div>
    <div class="refund-footer">
      <div class="btn" @click="handleSubmit">提交申请</div>
    </div>
    <up-picker 
      :show="showPicker" 
      :columns="[reasonOptions.map(item => item.label)]" 
      confirm-color="#ba2636" 
      @close="showPicker = false" 
      @confirm="confirmPicker"
    ></up-picker>
  </div>
</template>

<script setup lang="ts">
import { submitRefund } from '@/api/order'

const showPicker = ref(false)

const formData = ref({
  reason: '',
  reasonInfo: ''
})

const reasonOptions = [
  { label: '下错订单', value: '下错订单' },
  { label: '时间变更', value: '时间变更' },
  { label: '拍摄取消', value: '拍摄取消' },
  { label: '电话沟通未果', value: '电话沟通未果' },
  { label: '找到更合适选择', value: '找到更合适选择' },
  { label: '摄影师原因', value: '摄影师原因' },
  { label: '其他原因', value: '其他原因' }
]

const confirmPicker = (e: any) => {
  formData.value.reason = e.value[0]
  showPicker.value = false
}

const orderId = ref('')

onLoad((options: any) => {
  orderId.value = options.orderId
})

const handleSubmit = async () => {
  if (!formData.value.reason) {
    uni.showToast({
      title: '请选择退款原因',
      icon: 'none'
    })
    return
  }

  try {
    await submitRefund({
      id: orderId.value,
      reason: formData.value.reason,
      reasonInfo: formData.value.reasonInfo
    })
    uni.showToast({
      title: '申请退款成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '申请退款失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.refund {
  width: 100vw;
  height: 100vh;
  padding: 32rpx;
  background-color: #f6f6f6;
  box-sizing: border-box;

  &-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 48rpx;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 16rpx;

    &-header {
      font-size: 32rpx;
      font-weight: 500;
      margin-bottom: 24rpx;

      .required {
        color: #ba2636;
        margin-right: 4rpx;
      }
    }

    &-content {
      width: 100%;
      padding: 20rpx;
      font-size: 28rpx;
      color: #282828;
      border: 1rpx solid rgba(0, 0, 0, 0.10);
      border-radius: 12rpx;
      box-sizing: border-box;

      .selector {
        height: 44rpx;
        line-height: 44rpx;
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