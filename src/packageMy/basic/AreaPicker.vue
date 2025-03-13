<template>
  <div>
    <up-picker 
      :show="show" 
      ref="uPickerRef" 
      :loading="loading" 
      :columns="columns" 
      @change="changeHandler" 
      @confirm="confirmHandler" 
      @cancel="cancelHandler"
      confirmColor="#ba2636"
    >
    </up-picker>
    <div class="picker-trigger" @click="togglePicker">{{ selectedAreaText || '请选择地区' }}</div>
  </div>
</template>

<script setup lang="ts">
import { getArea } from '@/api/my';

interface AreaItem {
  text: string;
  value: number;
  children?: AreaItem[];
}

interface AreaModelValue {
  areaId: number | null;
  areaName: string;
}

const props = defineProps<{
  modelValue: AreaModelValue;
}>();

const emit = defineEmits(['update:modelValue']);
const show = ref(false);
const loading = ref(false);
const columns = ref<string[][]>([[], [], []]);
const uPickerRef = ref<any>(null);
const selectedIndexes = ref<number[]>([0, 0, 0]);
const transformedData = ref<AreaItem[]>([]);

const selectedArea = ref<(AreaItem | null)[]>([null, null, null]);

const selectedAreaText = computed(() => {
  return selectedArea.value.map(item => item ? item.text : '').filter(Boolean).join(' ') || props.modelValue.areaName
});

const transformAreaList = (areaList: any[]): AreaItem[] => {
  return areaList.map(province => ({
    text: province.name,
    value: province.id,
    children: province.children.map((city: any) => ({
      text: city.name,
      value: city.id,
      children: city.children.map((district: any) => ({
        text: district.name,
        value: district.id
      }))
    }))
  }));
};

const updateColumns = (): void => {
  const provinces = transformedData.value;
  const cities = provinces[selectedIndexes.value[0]]?.children || [];
  const districts = cities[selectedIndexes.value[1]]?.children || [];

  columns.value = [
    provinces.map(province => province.text),
    cities.map(city => city.text),
    districts.map(district => district.text)
  ];
};

const getData = async (): Promise<void> => {
  loading.value = true;
  const areaList = (await getArea()).data;
  transformedData.value = transformAreaList(areaList);
  updateColumns();
  loading.value = false;
};

const changeHandler = (e: { columnIndex: number; index: number }): void => {
  const { columnIndex, index } = e;
  selectedIndexes.value[columnIndex] = index;

  if (columnIndex === 0) {
    selectedIndexes.value[1] = 0;
    selectedIndexes.value[2] = 0;
  } else if (columnIndex === 1) {
    selectedIndexes.value[2] = 0;
  }
  
  updateColumns();
};

const confirmHandler = (): void => {
  const selectedProvince = transformedData.value[selectedIndexes.value[0]];
  const selectedCity = selectedProvince.children?.[selectedIndexes.value[1]];
  const selectedDistrict = selectedCity?.children?.[selectedIndexes.value[2]];

  if (selectedProvince && selectedCity && selectedDistrict) {
    selectedArea.value = [selectedProvince, selectedCity, selectedDistrict];
    emit('update:modelValue', { areaId: selectedDistrict.value, areaName: selectedDistrict.text });
  }
  show.value = false;
};

const cancelHandler = (): void => {
  show.value = false;
};

const togglePicker = (): void => {
  show.value = !show.value;
};

onMounted(async () => {
  await getData();
});
</script>

<style scoped>
.picker-trigger {
  cursor: pointer;
  width: 500rpx;
}
</style>
