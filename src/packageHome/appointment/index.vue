<template>
  <div class="appointment">
    <div class="appointment-header">
      <div class="left">选择拍摄时间</div>
      <div class="right">05/23 13:00 - 17:00</div>
    </div>
    <div class="appointment-divider"></div>
    <div class="appointment-main">
      <div class="appointment-main-header">
        <div class="left">05/23 - 05/29</div>
        <div class="right">查看其他日期</div>
      </div>
      <div class="appointment-main-tab">
        <div
          class="appointment-main-tab-item"
          v-for="(item, index) in 7"
          :key="index"
          :class="{'active': selectedIndex === index}"
          @click="handleTabClick(index)"
        >
          <span class="week mb-10rpx">周五</span>
          <span class="day">23</span>
        </div>
      </div>
      <div class="appointment-main-timeline">
        <div class="left">
          <div class="left-btn">上午</div>
          <div class="left-btn">下午</div>
        </div>
        <div class="divider"></div>
        <div class="right">
          <div class="right-content">
            <div class="right-btn">10:00 - 12:00</div>
            <div class="right-btn">10:00 - 12:00</div>
            <div class="right-btn">10:00 - 12:00</div>
            <div class="right-btn">10:00 - 12:00</div>
            <div class="right-btn">10:00 - 12:00</div>
            <div class="right-btn">10:00 - 12:00</div>

          </div>

        </div>
      </div>
    </div>
    <div class="appointment-divider2"></div>
    <div class="appointment-footer">
      <div class="appointment-footer-btn mr-20rpx" @click="handlePre">上一步</div>
      <div class="appointment-footer-btn btn" @click="handleNext">下一步</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedIndex = ref<number | null>(1);

const handleTabClick = (index: number) => {
  selectedIndex.value = index;
}

const handlePre = () => {
  uni.navigateBack()
}

const handleNext = (index: number) => {
  uni.navigateTo({ url: '/packageHome/appointmentDetail/index' })
}
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