<template>
  <div class="my w-100vw h-100vh relative">
    <div class="purplegirl"></div>
    <div class="redball"></div>
    <div class="my-main">
      <div class="my-main-info">
        <div class="my-main-info-header"></div>
        <div class="my-main-info-desc">
          <div class="my-main-info-desc-left">
            <div class="my-main-info-desc-left-top">
              <image @click="previewPicture" :src="user.avatar ? user.avatar : netConfig.picURL + '/static/my/avatar.jpg'" mode="aspectFill" class="avatar" />
              <span style="font-size: 40rpx; font-weight: 400;"> {{ isLoggedIn ? user.nickname : '未登录' }}</span>
            </div>
            <div class="my-main-info-desc-left-bottom">
              <div v-html="babyBirthdayDisplay" class="date"></div>
              <div v-html="weddingAnniversaryDisplay" class="date"></div>
              <div v-html="birthdayDisplay" class="date"></div>
              <div class="btn mt-10rpx" @click="isLoggedIn && edit()">编辑资料</div>
            </div>
          </div>
          <div class="my-main-info-desc-right">
            <image :src="netConfig.picURL + '/static/my/girl.png'" class="w-300rpx" mode="widthFix" />
          </div>
        </div>
      </div>
      <div class="my-main-menu">
        <div class="my-main-menu-tab">
          <div v-for="(item, index) in tabItems" :key="index" class="tab">
            <div class="tab-icon">
              <image :src="netConfig.picURL + item.icon" class="w-64rpx h-64rpx" />
            </div>
            <span style="font-size: 28rpx;">{{ item.text }}</span>
          </div>
        </div>
        <div class="my-main-menu-logout" @click="handleLogin">
          {{ isLoggedIn ? '退出登录' : '登录' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { netConfig } from '@/config/net.config';
import { getUserInfo } from '@/api/my/index';
import { UserVO } from '@/api/auth/types';
import { useUserStore } from '@/pinia/user'
import { useNotification } from '@/hooks/useNotification';
const { isLoggedIn } = useUserStore()


const loading = ref(false);
const user = ref<UserVO>({} as UserVO);
const babyBirthdayDisplay = ref('');
const weddingAnniversaryDisplay = ref('');
const birthdayDisplay = ref('');

const { showModal } = useNotification()

const handleLogin = () => {
  if(!isLoggedIn) {
      uni.navigateTo({
      url: '/pages/auth/index'
    })
  } else {
    showModal({
      title: '退出确认',
      content: '是否确认退出登录？'
    }).then(() => {
      const userStore = useUserStore()
      userStore.logout()
      uni.showToast({
        title: '退出登录成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(() => {
        uni.reLaunch({
            url: '/pages/my/index' // 当前页面的路径
        })
      }, 2000);

    }).catch(() => {
      // 用户取消退出，不执行任何操作
    })
  }
}

const edit = () => {
  uni.navigateTo({
    url: '/packageMy/basic/index'
  });
}

const previewPicture = () => {
  const urls = ref<any>([])
  const url = user.value.avatar
  urls.value.push(url)
  uni.previewImage({
    urls: urls.value,
    current: url
  });
}

// 格式化日期为显示内容
const formatDateDisplay = (date: string | number | null, type: string) => {
  if (!date) return '';
  const today = dayjs().startOf('day');
  const targetDate = dayjs(date);
  
  // 使用当前年份和目标日期的月日
  let nextDate = dayjs().year(today.year()).month(targetDate.month()).date(targetDate.date()).startOf('day');
  
  // 如果计算出的日期已经过去，则使用明年的日期
  if (nextDate.isBefore(today)) {
    nextDate = nextDate.add(1, 'year');
  }
  
  const daysLeft = nextDate.diff(today, 'day');

  // 如果是今天
  if (daysLeft === 0) {
    return `<span>您的${type}就是<span style="color: #ba2636">今天！</span></span>`;
  }
  return `<span>距离您的${type} <span style="color: #ba2636">${daysLeft}</span> 天</span>`;
};

// 获取数据
const getData = async () => {
  loading.value = true;
  try {
    user.value = (await getUserInfo()).data;

    // 防止生日为 null
    if (user.value.birthday == null) user.value.birthday = dayjs().valueOf();

    // 格式化宝宝生日、结婚纪念日、生日信息
    babyBirthdayDisplay.value = formatDateDisplay(user.value.babyBirthday, '宝宝生日');
    weddingAnniversaryDisplay.value = formatDateDisplay(user.value.weddingAnniversary, '结婚纪念日');
    birthdayDisplay.value = formatDateDisplay(user.value.birthday, '生日');
  } finally {
    loading.value = false;
  }
};

const tabItems = [
  { icon: '/static/my/mail.svg', text: '意见反馈' },
  { icon: '/static/my/proxy.svg', text: '服务建议' },
  { icon: '/static/my/chat.svg', text: '在线客服' },
  { icon: '/static/my/paper.svg', text: '开具发票' },
];

onMounted(async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
@import '@/styles/animation.scss';

.my {
  display: flex;

  .purplegirl {
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 224rpx;
    filter: blur(40px);
    background: linear-gradient(270deg, #FEF4FA 14.42%, #EEE7F9 55.21%, #E1F0FD 96%);
  }
  .redball {
    position: absolute;
    z-index: -1;
    top: 268rpx;
    left: 122rpx;
    width: 266rpx;
    height: 492rpx;
    background-color: #FCE1E1;
    opacity: 0.6;
    filter: blur(70rpx);
  }

  &-main {
    display: flex;
    flex-direction: column;

    &-info {
      width: 100vw;
      height: 54vh;
      display: flex;
      flex-direction: column;

      &-header {
        display: flex;
        height: 88rpx;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 32rpx;
        margin-top: 88rpx;
      }

      &-desc {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding: 32rpx;

        &-left {
          width: 385rpx;

          &-top {
            display: flex;
            align-items: center;
            margin-bottom: 78rpx;
            .avatar {
              width: 128rpx;
              height: 128rpx;
              border-radius: 50%;
              margin-right: 48rpx;
            }
          }

          &-bottom {
            display: flex;
            flex-direction: column;
            padding-left: 22rpx;
            color: rgba(40, 40, 40, 0.85);
            font-size: 28rpx;
            font-weight: 300;

            .date {
              margin-bottom: 28rpx;
            }

            .btn {
              width: 160rpx;
              height: 64rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 12rpx;
              border: 0.33px solid rgba(40, 40, 40, 0.85);
            }
          }
        }
      }
    }

    &-menu {
      width: 100vw;
      height: 46vh;
      background-color: #f6f6f6;
      border-radius: 64rpx 64rpx 0 0;
      box-sizing: border-box;
      padding: 32rpx;
      padding-top: 40rpx;

      &-tab {
        width: 100%;
        box-sizing: border-box;
        height: 192rpx;
        background-color: #fff;
        border-radius: 32rpx;
        display: flex;
        padding: 40rpx;
        color: rgba(40, 40, 40, 0.85);
        .tab {
          width: 25%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }
      }

      &-logout {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        margin-top: 96rpx;
        color: rgba(0, 0, 0, 0.50);
        font-weight: 300;
      }
    }
  }
}
</style>
