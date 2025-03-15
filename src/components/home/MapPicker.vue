<template>
  <div class="map-picker" v-if="show">
    <div class="map-picker-header">
      <div class="map-picker-title">选择位置</div>
      <div class="map-picker-close" @click="handleClose">×</div>
    </div>
    <div class="map-picker-search">
      <input
        v-model="searchKeyword"
        class="map-picker-search-input"
        placeholder="搜索地点"
        @input="handleSearch"
      />
    </div>
    <div class="map-picker-content">
      <div id="map" class="map-container"></div>
      <div class="search-result" v-if="searchResults.length">
        <div
          v-for="(item, index) in searchResults"
          :key="index"
          class="search-result-item"
          @click="handleSelectLocation(item)"
        >
          <div class="location-name">{{ item.title }}</div>
          <div class="location-address">{{ item.address }}</div>
        </div>
      </div>
    </div>
    <div class="map-picker-footer">
      <div class="btn" @click="handleConfirm">确认选择</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['update:show', 'confirm']);

const map = ref<any>(null);
const searchKeyword = ref('');
const searchResults = ref<any[]>([]);
const selectedLocation = ref<any>(null);

let searchService: any;
let geocoder: any;

const initMap = () => {
  // @ts-ignore
  map.value = new TMap.Map(document.getElementById('map'), {
    center: new TMap.LatLng(39.908802, 116.397502),
    zoom: 12
  });

  // @ts-ignore
  searchService = new TMap.service.Search();
  // @ts-ignore
  geocoder = new TMap.service.Geocoder();

  map.value.on('click', handleMapClick);
};

const handleSearch = async () => {
  if (!searchKeyword.value) {
    searchResults.value = [];
    return;
  }

  try {
    const result = await searchService.search({
      keyword: searchKeyword.value,
      boundary: 'region(北京,0)'
    });

    searchResults.value = result.data;
  } catch (error) {
    console.error('搜索失败：', error);
  }
};

const handleMapClick = async (evt: any) => {
  const { lat, lng } = evt.latLng;
  
  try {
    const result = await geocoder.getAddress({
      location: { lat, lng }
    });

    if (result.status === 0) {
      selectedLocation.value = {
        latitude: lat,
        longitude: lng,
        address: result.result.address,
        formatted_addresses: result.result.formatted_addresses,
        address_component: result.result.address_component
      };
    }
  } catch (error) {
    console.error('获取地址失败：', error);
  }
};

const handleSelectLocation = (location: any) => {
  selectedLocation.value = location;
  map.value.setCenter(new TMap.LatLng(location.location.lat, location.location.lng));
};

const handleClose = () => {
  emit('update:show', false);
};

const handleConfirm = () => {
  if (selectedLocation.value) {
    emit('confirm', selectedLocation.value);
    emit('update:show', false);
  }
};

watch(() => props.show, (newVal) => {
  if (newVal && !map.value) {
    nextTick(() => {
      initMap();
    });
  }
});
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

  &-search {
    padding: 20rpx 32rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

    &-input {
      width: 100%;
      height: 72rpx;
      background: #f5f5f5;
      border-radius: 36rpx;
      padding: 0 32rpx;
      font-size: 28rpx;
    }
  }

  &-content {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  &-footer {
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1rpx solid rgba(0, 0, 0, 0.1);

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
}

.map-container {
  width: 100%;
  height: 100%;
}

.search-result {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  max-height: 60vh;
  overflow-y: auto;

  &-item {
    padding: 20rpx 32rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);

    .location-name {
      font-size: 28rpx;
      color: #282828;
      margin-bottom: 8rpx;
    }

    .location-address {
      font-size: 24rpx;
      color: #999;
    }
  }
}
</style>