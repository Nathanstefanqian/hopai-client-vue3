<template>
  <div class="test"> 123 </div>
  <button @click="handleClick">点击</button>
</template>

<script setup lang="ts">
  import { SSEProcessor } from 'sse-kit/lib/bundle.weapp.esm';
  import { useUserStore } from '@/pinia/user';

  const userStore = useUserStore();
  const header = {
    header: {
      Authorization: `Bearer ${userStore.token}`,
    },
  };
  const sseInstance = new SSEProcessor({
    url: 'https://api.hopai.cn/app-api/member/order/streamOrderStatus',
    method: 'GET',
    reqParams: { id: '1916073532582330370' },
    headers: { Authorization: `Bearer ${userStore.token}` },
    enableConsole: true, // 开启调试日志
    timeout: 100000,
    // 生命周期回调
    onHeadersReceived: headers => console.log('连接成功'),
    onComplete: () => console.log('请求完成'),
    onError: err => console.error('请求错误', err),

    // 数据预处理
    preprocessDataCallback: data => {
      // 处理数据
      console.log('数据预处理', data);
      return data;
    },
  });
  const handleClick = async () => {
    console.log('点击了按钮');
    // 获取 SSE 请求数据；
    for await (const chunk of sseInstance.message()) {
      // const decoder = new TextDecoder();
      // const text = decoder.decode(chunk);
      console.log('获取到新的 chunk----------:');
    }
  };
</script>

<style scoped>
  .test {
    margin-top: 100rpx;
    margin-left: 20rpx;
  }
</style>
