<template>
  <div class="map-picker" v-if="show">
    <div class="map-picker-header">
      <div class="map-picker-title">选择位置</div>
      <div class="map-picker-close" @click="handleClose">×</div>
    </div>
    <div class="map-picker-content">
      <div class="btn" @click="handleChooseLocation">选择位置</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['update:show', 'confirm']);

const handleChooseLocation = async () => {
  try {
    const location = await uni.chooseLocation();
    if (location) {
      const selectedLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        name: location.name
      };
      emit('confirm', selectedLocation);
      emit('update:show', false);
    }
  } catch (error) {
    console.error('选择位置失败：', error);
  }
};

const handleClose = () => {
  emit('update:show', false);
};
</script>

<style lang="scss" scoped>
.map-picker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 999;
  display: flex;
  flex-direction: column;

  &-header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
  }

  &-title {
    font-size: 32rpx;
    font-weight: 500;
  }

  &-close {
    position: absolute;
    right: 32rpx;
    font-size: 40rpx;
    color: #999;
  }

  &-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn {
    width: 686rpx;
    height: 80rpx;
    background: #282828;
    border-radius: 12rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }
}
</style>