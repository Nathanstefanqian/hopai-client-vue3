<template>
  <div class="create">
    <div class="form">
      <div class="form-item">
        <span class="label">发票抬头</span>
        <input type="text" v-model="form.title" placeholder="请输入发票抬头" class="input" />
      </div>
      <div class="form-item">
        <span class="label">发票类型</span>
        <div class="radio-group">
          <div class="radio" :class="{ active: form.type === 1 }" @click="form.type = 1">个人</div>
          <div class="radio" :class="{ active: form.type === 2 }" @click="form.type = 2">企业</div>
        </div>
      </div>
      <div class="form-item" v-if="form.type === 2">
        <span class="label">税号</span>
        <input type="text" v-model="form.taxNumber" placeholder="请输入纳税人识别号" class="input" />
      </div> 
      <div class="form-item">
        <span class="label">发票金额</span>
        <input type="number" v-model="form.amount" placeholder="请输入发票金额" class="input" />
      </div>
      <div class="form-item">
        <span class="label">发票内容</span>
        <input type="text" v-model="form.content" placeholder="请输入发票内容" class="input" />
      </div>
    </div>
    <div class="submit" @click="handleSubmit">
      <div class="submit-btn">提交</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/hooks/useNotification';

const { message } = useNotification();

const form = ref({
  title: '',
  type: 1, // 1: 个人, 2: 企业
  taxNumber: '',
  amount: '',
  content: ''
});

const handleSubmit = () => {
  if (!form.value.title) {
    message({ title: '请输入发票抬头' });
    return;
  }
  if (form.value.type === 2 && !form.value.taxNumber) {
    message({ title: '请输入纳税人识别号' });
    return;
  }
  if (!form.value.amount) {
    message({ title: '请输入发票金额' });
    return;
  }
  if (!form.value.content) {
    message({ title: '请输入发票内容' });
    return;
  }
  // TODO: 调用开具发票接口
  message({ title: '开具发票成功' });
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.create {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #f6f6f6;
  padding: 32rpx;
  box-sizing: border-box;

  .form {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 32rpx;

    &-item {
      margin-bottom: 32rpx;

      .label {
        display: block;
        font-size: 28rpx;
        margin-bottom: 16rpx;
      }

      .input {
        width: 100%;
        height: 80rpx;
        border-radius: 12rpx;
        background-color: #f6f6f6;
        padding: 0 24rpx;
        box-sizing: border-box;
        font-size: 28rpx;
      }

      .radio-group {
        display: flex;
        gap: 24rpx;

        .radio {
          flex: 1;
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12rpx;
          background-color: #f6f6f6;
          font-size: 28rpx;
          color: rgba(40, 40, 40, 0.5);

          &.active {
            background-color: #ba2636;
            color: #fff;
          }
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 160rpx;
    background-color: #fff;
    color: #fff;
    font-size: 32rpx;
    border-radius: 12rpx;
    margin-top: 32rpx;
    border-top: 2rpx solid #eaedf1 !important;

    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
      width: 400rpx;
      height: 80rpx;
      background-color: #000;
      color: #fff;
    }
  }
}
</style>