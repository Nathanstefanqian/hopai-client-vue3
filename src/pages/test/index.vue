<template>
  <button @click="start" style="margin-top: 100rpx">开始</button>
  <button @click="stop">停止</button>
  <template v-if="loading">
    <view>{{ openLoading ? '正在连接sse...' : '连接完成！' }}</view>
    <view>{{ loading ? '加载中...' : '' }}</view>
  </template>

  <view>
    {{ responseText }}
  </view>

  <gao-ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore" @onFinish="finishCore" />
</template>

<script setup>
  import { ref } from 'vue';
  import { useUserStore } from '@/pinia/user';
  const userStore = useUserStore();
  const chatSSEClientRef = ref(null);
  const responseText = ref('');
  const loading = ref(false);
  const openLoading = ref(false);

  const openCore = response => {
    openLoading.value = false;
    console.log('open sse：', response);
  };
  const errorCore = err => {
    console.log('error sse：', err);
  };
  const messageCore = msg => {
    console.log('message sse：', msg);
    responseText.value += `${msg.data}

  `;
  };
  const finishCore = () => {
    console.log('finish sse');
    loading.value = false;
  };

  const start = () => {
    if (loading.value) return;

    openLoading.value = true;
    loading.value = true;
    responseText.value = '';

    chatSSEClientRef.value.startChat({
      /**
       * 将它换成你的地址
       * 注意：
       * 如果使用 sse-server.js 要在手机端使用的话，请确保你的手机和电脑处在一个局域网下并且是正常的ip地址
       */
      url: 'https://api.hopai.cn/app-api/member/order/streamOrderStatus',
      // 请求头
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      // 默认为 post
      method: 'get',
      body: {
        id: '1916154798681948162',
      },
    });
  };
  const stop = () => {
    chatSSEClientRef.value.stopChat();
    console.log('stop');
  };
</script>
