<template>
  <div class="detail">
    <div class="detail-item">
      <div class="detail-item-header">联系人</div>
      <input v-model="formData.name" class="detail-item-input" placeholder="姓名" />
      <input v-model="formData.phone" class="detail-item-input" placeholder="手机号" />
    </div>
    <div class="detail-item">
      <div class="detail-item-header">拍摄地点</div>
      <div class="detail-item-input" @click="handleChooseLocation">{{ formData.area || '点击选择位置' }}</div>
      <input v-model="formData.address" class="detail-item-input" placeholder="详细地址" disabled />
      <input v-model="formData.areaCode" class="detail-item-input" placeholder="区域编码" disabled />
    </div>
    <div class="detail-item">
      <div class="detail-item-header">备注</div>
      <textarea
        v-model="formData.remark"
        class="detail-item-input h-300rpx w-95%"
        placeholder="请输入100个字以内备注信息"
        maxlength="100"
      ></textarea>
      <div class="remark-count">{{ formData.remark.length }}/100</div>
    </div>
    <div class="detail-footer">
      <div class="btn mr-20rpx" @click="handlePrev">上一步</div>
      <div class="btn btn1" @click="handleNext">下一步</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLocationInfo } from '@/utils/location';

const formData = reactive({
  name: '',
  phone: '',
  area: '',
  address: '',
  remark: '',
  latitude: 0,
  longitude: 0,
  areaCode: ''
});

onMounted(() => {
  const cachedInfo = uni.getStorageSync('contactInfo');
  if (cachedInfo) {
    Object.assign(formData, cachedInfo);
  }
});

const errors = reactive({
  phone: ''
});

const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!formData.phone) {
    errors.phone = '请输入手机号';
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = '请输入正确的手机号';
  } else {
    errors.phone = '';
  }
};

const handleChooseLocation = () => {
  uni.chooseLocation({
    success: async (res) => {
      const { name, address, latitude, longitude } = res;
      try {
        const locationInfo = await getLocationInfo(latitude, longitude);
        formData.area = name;
        formData.address = address;
        formData.latitude = latitude;
        formData.longitude = longitude;
        formData.areaCode = locationInfo.areaCode;
        uni.setStorageSync('selectedAreaCode', locationInfo.areaCode);
      } catch (error) {
        uni.showToast({
          title: '获取地理位置信息失败',
          icon: 'none'
        });
      }
    },
    fail: () => {
      uni.showToast({
        title: '选择位置失败',
        icon: 'none'
      });
    }
  });
};

const handlePrev = () => {
  uni.navigateBack();
};

const handleNext = () => {
  // 验证表单
  validatePhone();
  
  // 检查各个必填字段
  if (!formData.name) {
    uni.showToast({
      title: '请填写姓名',
      icon: 'none'
    });
    return;
  }
  
  if (!formData.phone) {
    uni.showToast({
      title: '请填写手机号',
      icon: 'none'
    });
    return;
  }
  
  if (errors.phone) {
    uni.showToast({
      title: errors.phone,
      icon: 'none'
    });
    return;
  }
  
  if (!formData.area) {
    uni.showToast({
      title: '请选择拍摄地点',
      icon: 'none'
    });
    return;
  }
  
  if (!formData.address) {
    uni.showToast({
      title: '请填写详细地址',
      icon: 'none'
    });
    return;
  }
  // 存储联系人信息
  uni.setStorageSync('contactInfo', {
    name: formData.name,
    phone: formData.phone,
    area: formData.area,
    address: formData.address,
    areaCode: formData.areaCode,
    remark: formData.remark
  });
  uni.navigateTo({
    url: '/packageHome/appointment/photographer'
  });
};
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
  
  &-item {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    margin-bottom: 48rpx;
    width: 100%;
    &-input {
      padding: 26rpx;
      font-size: 28rpx;
      color: #282828;
      border: 1rpx solid rgba(0, 0, 0, 0.10);
      border-radius: 12rpx;
      margin-top: 24rpx;
      background-color: #fff;
      &::placeholder {
        color: rgba(40, 40, 40, 0.30);
      }
    }
  }

  &-footer {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 32rpx 64rpx 64rpx 64rpx;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 180rpx;
    width: 100vw;
    border-top: 1rpx solid rgba(40, 40, 40, 0.10);

    .btn {
      width: 300rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12rpx;
      border: 1rpx solid #282828;
    }

    .btn1 {
      color: #fff;
      background-color: #282828;
    }
  }
}

.error-text {
  font-size: 24rpx;
  color: #ba2636;
  margin-top: 8rpx;
  padding-left: 26rpx;
}

.remark-count {
  font-size: 24rpx;
  color: rgba(40, 40, 40, 0.50);
  text-align: right;
  margin-top: 8rpx;
}
</style>