<template>
  <div class="appointment">
    <div class="appointment-header">
      <div class="left">选择拍摄时间</div>
      <div class="right">{{ selectedDate ? formatDate(selectedDate, 'MM/DD HH:mm') : '' }} - {{ selectedEndTime ? formatDate(selectedEndTime, 'HH:mm') : '' }}</div>
    </div>
    <div class="appointment-divider"></div>
    <div class="appointment-main">
      <div class="appointment-main-header">
        <div class="left">{{ weekRange }}</div>
        <div class="right" @click="showCalendar = true">查看其他日期</div>
      </div>
      <div class="appointment-main-tab">
        <div
          class="appointment-main-tab-item"
          v-for="(item, index) in weekDays"
          :key="index"
          :class="{
            'active': selectedIndex === index,
            'disabled': item.date < Date.now() - 24 * 60 * 60 * 1000
          }"
          @click="!isDateDisabled(item.date) && handleTabClick(index)"
        >
          <span class="week mb-10rpx">{{ item.weekDay }}</span>
          <span class="day">{{ item.day }}</span>
        </div>
      </div>
      <div class="appointment-main-timeline">
        <div class="left">
          <div class="left-btn" :class="{'active': timeSlot === 'morning'}" @click="handleTimeSlotClick('morning')">上午</div>
          <div class="left-btn" :class="{'active': timeSlot === 'afternoon'}" @click="handleTimeSlotClick('afternoon')">下午</div>
          <div class="left-btn" :class="{'active': timeSlot === 'evening'}" @click="handleTimeSlotClick('evening')">晚上</div>
        </div>
        <div class="divider"></div>
        <div class="right">
          <div class="right-content">
            <template v-if="timeSlot === 'morning'">
              <div 
                v-for="time in morningTimes" 
                :key="time"
                class="right-btn" 
                :class="{
                  'active': selectedTime === time,
                  'disabled': isTimeDisabled(time)
                }" 
                @click="handleTimeClick(time)"
              >{{ time }}</div>
            </template>
            <template v-else-if="timeSlot === 'afternoon'">
              <div 
                v-for="time in afternoonTimes" 
                :key="time"
                class="right-btn" 
                :class="{
                  'active': selectedTime === time,
                  'disabled': isTimeDisabled(time)
                }" 
                @click="handleTimeClick(time)"
              >{{ time }}</div>
            </template>
            <template v-else>
              <div 
                v-for="time in eveningTimes" 
                :key="time"
                class="right-btn" 
                :class="{
                  'active': selectedTime === time,
                  'disabled': isTimeDisabled(time)
                }" 
                @click="handleTimeClick(time)"
              >{{ time }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="appointment-divider2"></div>
    <div class="appointment-footer">
      <div class="appointment-footer-btn mr-20rpx" @click="handlePre">上一步</div>
      <div class="appointment-footer-btn btn" @click="handleNext">下一步</div>
    </div>
    <up-datetime-picker
      :show="showCalendar"
      confirmColor="#ba2636"
      @confirm="confirmDate"
      v-model="calendarDate"
      mode="date"
      @close="showCalendar = false"
      :min-date="Date.now()"
      :max-date="Date.now() + 90 * 24 * 60 * 60 * 1000"
    />
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';

const selectedIndex = ref<number>(0);
const showCalendar = ref(false);
const calendarDate = ref<number>(Date.now());
const selectedDate = ref<number | null>(null);
const selectedEndTime = ref<number | null>(null);
const weekDays = ref<Array<{ date: number; weekDay: string; day: string }>>([]);
const timeSlot = ref('morning');
const selectedTime = ref('');

// 生成时间段
const generateTimeSlots = (startHour: number, endHour: number, endMinute: number = 0) => {
  const slots = [];
  let currentHour = startHour;

  while (currentHour < endHour || (currentHour === endHour && endMinute > 0)) {
    const nextHour = currentHour + 1;
    const timeSlot = `${String(currentHour).padStart(2, '0')}:00-${String(nextHour).padStart(2, '0')}:00`;
    slots.push(timeSlot);
    currentHour++;
  }
  return slots;
};

// 定义时间段
const morningTimes = computed(() => generateTimeSlots(8, 12, 30));
const afternoonTimes = computed(() => generateTimeSlots(13, 18, 30));
const eveningTimes = computed(() => generateTimeSlots(19, 22, 30));

// 判断时间是否禁用
const isTimeDisabled = (time: string) => {
  if (!selectedDate.value) return true;
  
  const [startTime] = time.split('-');
  const [hours, minutes] = startTime.split(':').map(Number);
  const timeToCheck = new Date(selectedDate.value);
  timeToCheck.setHours(hours, minutes);
  
  return timeToCheck.getTime() <= Date.now();
};

// 获取当前时间段的下一个可用时间
const getNextAvailableTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour < 12 || (currentHour === 12 && currentMinute <= 30)) {
    timeSlot.value = 'morning';
    return morningTimes.value.find(time => !isTimeDisabled(time));
  } else if (currentHour < 18 || (currentHour === 18 && currentMinute <= 30)) {
    timeSlot.value = 'afternoon';
    return afternoonTimes.value.find((time: any) => !isTimeDisabled(time));
  } else if (currentHour < 22 || (currentHour === 22 && currentMinute <= 30)) {
    timeSlot.value = 'evening';
    return eveningTimes.value.find(time => !isTimeDisabled(time));
  }
  return null;
};

// 计算周范围显示
const weekRange = computed(() => {
  if (weekDays.value.length === 0) return '';
  const firstDay = weekDays.value[0].date;
  const lastDay = weekDays.value[6].date;
  return `${formatDate(firstDay, 'MM/DD')} - ${formatDate(lastDay, 'MM/DD')}`;
});

// 定义日期是否禁用
const isDateDisabled = (date: number) => {
  return date < Date.now() - 24 * 60 * 60 * 1000;
};

// 更新一周的日期
const updateWeekDays = (date: number) => {
  const currentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(currentDate.setDate(diff));

  const days = [];
  const weekDayMap = ['一', '二', '三', '四', '五', '六', '日'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    days.push({
      date: date.getTime(),
      weekDay: `周${weekDayMap[i]}`,
      day: String(date.getDate()).padStart(2, '0')
    });
  }
  
  weekDays.value = days;
  // 找到与选择日期匹配的索引
  const selectedDayIndex = days.findIndex(day => {
    const dayDate = new Date(day.date);
    const selectedDate = new Date(date);
    return dayDate.getDate() === selectedDate.getDate() &&
           dayDate.getMonth() === selectedDate.getMonth() &&
           dayDate.getFullYear() === selectedDate.getFullYear();
  });

  // 如果找到匹配的日期且该日期未被禁用，则选择该日期
  // 否则选择当前周的第一个可用日期
  if (selectedDayIndex !== -1 && !isDateDisabled(days[selectedDayIndex].date)) {
    handleTabClick(selectedDayIndex);
  } else {
    const availableDayIndex = days.findIndex(day => !isDateDisabled(day.date));
    if (availableDayIndex !== -1) {
      handleTabClick(availableDayIndex);
    }
  }
};

// 处理标签点击
const handleTabClick = (index: number) => {
  if (isDateDisabled(weekDays.value[index].date)) return;
  
  selectedIndex.value = index;
  const selectedDay = weekDays.value[index];
  selectedDate.value = selectedDay.date;
  const nextAvailableTime = getNextAvailableTime();
  if (nextAvailableTime) {
    handleTimeClick(nextAvailableTime);
  }
};

const handlePre = () => {
  uni.navigateBack();
};

const handleNext = () => {
  if (!selectedDate.value || !selectedEndTime.value) {
    uni.showToast({
      title: '请选择预约时间',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({ url: '/packageHome/appointmentDetail/index' });
};

const handleTimeSlotClick = (slot: 'morning' | 'afternoon' | 'evening') => {
  if (timeSlot.value === slot) return;
  
  timeSlot.value = slot;
  
  // 如果当前选中的时间不在新选择的时间段内，则清空选中状态
  if (selectedTime.value) {
    const [startStr] = selectedTime.value.split('-');
    const [hours] = startStr.split(':').map(Number);
    
    const isInCurrentSlot = 
      (slot === 'morning' && hours >= 8 && hours < 12) ||
      (slot === 'afternoon' && hours >= 13 && hours < 18) ||
      (slot === 'evening' && hours >= 19 && hours < 22);
    
    if (!isInCurrentSlot) {
      // 保持选中的时间不变，但不在新时间段中显示高亮
      selectedTime.value = '';
    }
  }
};

const handleTimeClick = (time: string) => {
  if (isTimeDisabled(time)) return;
  
  selectedTime.value = time;
  if (selectedDate.value) {
    const [startTime] = time.split('-');
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(selectedDate.value);
    date.setHours(hours, minutes);
    selectedDate.value = date.getTime();
    selectedEndTime.value = date.getTime() + 60 * 60 * 1000; // 1小时后
  }
};

// 监听日历日期变化
watch(calendarDate, (newDate) => {
  updateWeekDays(newDate);
});

// 组件挂载时初始化日期
onMounted(() => {
  updateWeekDays(Date.now());
});
const confirmDate = () => {
  showCalendar.value = false;
  updateWeekDays(calendarDate.value);
  
  // 找到选中日期对应的索引
  const selectedDayIndex = weekDays.value.findIndex(day => {
    const dayDate = new Date(day.date);
    const selectedDate = new Date(calendarDate.value);
    return dayDate.getDate() === selectedDate.getDate() &&
           dayDate.getMonth() === selectedDate.getMonth() &&
           dayDate.getFullYear() === selectedDate.getFullYear();
  });

  // 如果找到对应日期，则设置选中状态
  if (selectedDayIndex !== -1 && !isDateDisabled(weekDays.value[selectedDayIndex].date)) {
    handleTabClick(selectedDayIndex);
  }
};
</script>

<style lang="scss" scoped>
.appointment {
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;

  &-header {
    display: flex;
    justify-content: space-between;
    padding: 32rpx;

    .left {
      font-size: 28rpx;
    }

    .right {
      font-size: 28rpx;
      font-weight: 600;
      color: #ba2636;
    }
  }

  &-divider {
    width: 100vw;
    height: 2rpx;
    background-color: #f3f3f3;
  }

  &-main {
    width: 100%;
    padding: 32rpx;
    padding-bottom: 0rpx;
    background-color: #fff;
    box-sizing: border-box;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32rpx;
      .right {
        font-size: 28rpx;
      }
    }

    &-tab {
      display: flex;
      width: 100%;
      height: 150rpx;
      background: rgba(40, 40, 40, 0.06);
      margin-bottom: 32rpx;
      border-radius: 16rpx;
      .active {
        background-color: #ba2636;
        color: #fff;
      }
      
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 26rpx;
        flex: 1;
        transition: background-color 0.3s, color 0.3s;
        &:first-child {
          border-top-left-radius: 16rpx;
          border-bottom-left-radius: 16rpx;
        }

        &:last-child {
          border-top-right-radius: 16rpx;
          border-bottom-right-radius: 16rpx;
        }

        &.disabled {
          color: #999;
          background-color: #f3f3f3;
          cursor: not-allowed;
        }
      }
    }

    &-timeline {
      display: flex;
      height: 55vh;

      .left {
        display: flex;
        flex-direction: column;

        &-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120rpx;
          height: 80rpx;
          font-size: 28rpx;
          margin-bottom: 20rpx;
          border-radius: 8rpx;
          transition: all 0.3s;
          &.active {
            background-color: #ba2636;
            color: #fff;
          }
        }
      }

      .divider {
        width: 2rpx;
        background-color: #f3f3f3;
        margin: 0 32rpx;
      }

      .right {
        flex: 1;
        &-content {
          display: flex;
          flex-wrap: wrap;
          gap: 20rpx;
          .right-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: calc((100% - 40rpx) / 3);
            height: 80rpx;
            font-size: 28rpx;
            border-radius: 8rpx;
            background-color: #f8f8f8;
            transition: all 0.3s;
            &.active {
              background-color: #ba2636;
              color: #fff;
            }
            &.disabled {
              background-color: #f3f3f3;
              color: #999;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  &-divider2 {
    width: 100vw;
    height: 20rpx;
    background-color: #f8f8f8;
    margin: 32rpx 0;
  }

  &-footer {
    display: flex;
    justify-content: center;
    padding: 32rpx;
    &-btn {
      width: 320rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      border-radius: 44rpx;
      background-color: #f8f8f8;
      &.btn {
        background-color: #ba2636;
        color: #fff;
      }
    }
  }
}
</style>