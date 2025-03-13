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
          :class="{'active': selectedIndex === index}"
          @click="handleTabClick(index)"
        >
          <span class="week mb-10rpx">{{ item.weekDay }}</span>
          <span class="day">{{ item.day }}</span>
        </div>
      </div>
      <div class="appointment-main-timeline">
        <div class="left">
          <div class="left-btn" :class="{'active': timeSlot === 'morning'}" @click="handleTimeSlotClick('morning')">上午</div>
          <div class="left-btn" :class="{'active': timeSlot === 'afternoon'}" @click="handleTimeSlotClick('afternoon')">下午</div>
        </div>
        <div class="divider"></div>
        <div class="right">
          <div class="right-content">
            <template v-if="timeSlot === 'morning'">
              <div class="right-btn" :class="{'active': selectedTime === '10:00-12:00'}" @click="handleTimeClick('10:00-12:00')">10:00-12:00</div>
              <div class="right-btn" :class="{'active': selectedTime === '10:20-12:20'}" @click="handleTimeClick('10:20-12:20')">10:20-12:20</div>
              <div class="right-btn" :class="{'active': selectedTime === '10:40-12:40'}" @click="handleTimeClick('10:40-12:40')">10:40-12:40</div>
            </template>
            <template v-else>
              <div class="right-btn" :class="{'active': selectedTime === '13:00-15:00'}" @click="handleTimeClick('13:00-15:00')">13:00-15:00</div>
              <div class="right-btn" :class="{'active': selectedTime === '13:20-15:20'}" @click="handleTimeClick('13:20-15:20')">13:20-15:20</div>
              <div class="right-btn" :class="{'active': selectedTime === '13:40-15:40'}" @click="handleTimeClick('13:40-15:40')">13:40-15:40</div>
              <div class="right-btn" :class="{'active': selectedTime === '14:00-16:00'}" @click="handleTimeClick('14:00-16:00')">14:00-16:00</div>
              <div class="right-btn" :class="{'active': selectedTime === '14:20-16:20'}" @click="handleTimeClick('14:20-16:20')">14:20-16:20</div>
              <div class="right-btn" :class="{'active': selectedTime === '14:40-16:40'}" @click="handleTimeClick('14:40-16:40')">14:40-16:40</div>
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
const weekDays = ref<Array<{date: number; weekDay: string; day: string}>>([]);
const timeSlot = ref('morning');
const selectedTime = ref('');

// 计算周范围显示
const weekRange = computed(() => {
  if (weekDays.value.length === 0) return '';
  const firstDay = weekDays.value[0].date;
  const lastDay = weekDays.value[6].date;
  return `${formatDate(firstDay, 'MM/DD')} - ${formatDate(lastDay, 'MM/DD')}`;
});

// 更新一周的日期
const updateWeekDays = (date: number) => {
  const currentDate = new Date(date);
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一开始
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
};

// 初始化当前周并自动选择第一个时间段
onMounted(() => {
  updateWeekDays(Date.now());
  handleTabClick(0);
  handleTimeSlotClick('morning');
});

// 处理日期选择
const confirmDate = (e: { value: number }) => {
  showCalendar.value = false;
  calendarDate.value = e.value;
  updateWeekDays(e.value);
  
  // 找到选中日期在周数组中的索引
  const selectedDay = new Date(e.value).getDate();
  const index = weekDays.value.findIndex(item => 
    new Date(item.date).getDate() === selectedDay
  );
  if (index !== -1) {
    selectedIndex.value = index;
    // 保持原有的时间信息
    const currentHours = selectedDate.value ? new Date(selectedDate.value).getHours() : 0;
    const currentMinutes = selectedDate.value ? new Date(selectedDate.value).getMinutes() : 0;
    const newDate = new Date(weekDays.value[index].date);
    newDate.setHours(currentHours, currentMinutes);
    selectedDate.value = newDate.getTime();
    if (selectedEndTime.value) {
      selectedEndTime.value = selectedDate.value + 2 * 60 * 60 * 1000; // 保持2小时间隔
    }
  }
};

// 处理标签点击
const handleTabClick = (index: number) => {
  selectedIndex.value = index;
  const selectedDay = weekDays.value[index];
  selectedDate.value = selectedDay.date;
  // 设置默认结束时间为4小时后
  selectedEndTime.value = selectedDay.date + 4 * 60 * 60 * 1000;
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

const handleTimeSlotClick = (slot: 'morning' | 'afternoon') => {
  timeSlot.value = slot;
  selectedTime.value = '';
  selectedEndTime.value = null;
  // 自动选择该时段的第一个时间
  const defaultTime = slot === 'morning' ? '10:00-12:00' : '13:00-15:00';
  handleTimeClick(defaultTime);
};

const handleTimeClick = (time: string) => {
  selectedTime.value = time;
  // 解析时间并更新selectedEndTime
  if (selectedDate.value) {
    const [startTime] = time.split('-');
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(selectedDate.value);
    date.setHours(hours, minutes);
    selectedDate.value = date.getTime();
    selectedEndTime.value = date.getTime() + 2 * 60 * 60 * 1000; // 2小时后
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
      color: rgba(40, 40, 40, 0.50);
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
          border-top-left-radius: 16rpx; /* 左上圆角 */
          border-bottom-left-radius: 16rpx; /* 左下圆角 */
        }

        &:last-child {
          border-top-right-radius: 16rpx; /* 右上圆角 */
          border-bottom-right-radius: 16rpx; /* 右下圆角 */
        }
      }
    }

    &-timeline {
      display: flex;

      .left {
        display: flex;
        flex-direction: column;

        &-btn {
          display: inline-flex; /* 小盒子根据内容宽度自适应 */
          width: 70rpx;
          margin-right: 33rpx;
          padding: 20rpx 55rpx;
          margin-bottom: 32rpx;
          background-color: rgba(40,40,40,0.06);
          border-radius: 12rpx;
          transition: all 0.3s ease;
          &.active {
            background-color: #ba2636;
            color: #fff;
          }
        }
      }

      .divider {
        width: 2rpx;
        height: 900rpx;
        background: rgba(0, 0, 0, 0.12);
      }

      .right {
        // background-color: pink;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: start;
        &-content {
          display: flex;
          flex-wrap: wrap;
        }
        &-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 30rpx;
          border: 0.66rpx solid rgba(0, 0, 0, 0.12);
          background-color: #fff;
          box-sizing: border-box;
          width: 210rpx;
          height: 85rpx;
          font-size: 24rpx;
          border-radius: 12rpx;
          margin-bottom: 32rpx;
          transition: all 0.3s ease;
          cursor: pointer;

          &.active {
            background-color: #ba2636;
            color: #fff;
            border-color: #ba2636;
          }
        }
      }
    }
  }

  &-divider2 {
    width: 100vw;
    height: 2rpx;
    background-color: #f3f3f3;
  }

  &-footer {
    display: flex;
    padding: 32rpx 64rpx 64rpx 64rpx;
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
</style>