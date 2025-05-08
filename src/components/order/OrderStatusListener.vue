<template>
  <gao-ChatSSEClient ref="chatSSEClientRef" @onOpen="openCore" @onError="errorCore" @onMessage="messageCore" @onFinish="finishCore" />
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useUserStore } from '@/pinia/user';

  const props = defineProps<{
    orderId: string;
    showQrCode: boolean;
  }>();

  const emit = defineEmits<{
    onOpen: [response: any];
    onError: [error: any];
    onMessage: [message: any];
    onFinish: [];
  }>();

  const userStore = useUserStore();
  const chatSSEClientRef = ref(null);

  const openCore = (response: any) => {
    emit('onOpen', response);
  };

  const errorCore = (err: any) => {
    emit('onError', err);
  };

  const messageCore = (msg: any) => {
    if (msg.data === 'orderStatus: 3') {
      uni.showToast({
        title: '摄影师已验劵',
        icon: 'success',
        mask: true,
      });
      emit('onMessage', msg);
      stopSSE();
    }
    emit('onMessage', msg);
  };

  const finishCore = (msg: any) => {
    console.log('finish sse：', msg);
    emit('onFinish');
  };

  const startSSE = () => {
    chatSSEClientRef.value?.startChat({
      url: 'https://api.hopai.cn/app-api/member/order/streamOrderStatus',
      headers: {
        Authorization: 'Bearer ' + userStore.token,
      },
      method: 'get',
      body: {
        id: props.orderId,
      },
    });
  };

  const stopSSE = () => {
    chatSSEClientRef.value?.stopChat();
  };

  onMounted(() => {
    console.log('OrderStatusListener mounted');
    startSSE();
  });

  onUnmounted(() => {
    stopSSE();
  });

  // 暴露方法给父组件
  defineExpose({
    startSSE,
    stopSSE,
  });
</script>
