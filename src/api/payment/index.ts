import request from '@/utils/request';
import { pingppConfig } from '@/config/pingpp.config';

// 创建支付订单
export const createPayment = (data: {
  amount: number;  // 支付金额（分）
  channel: string; // 支付渠道
  orderId: string; // 订单ID
  subject: string; // 商品名称
  body: string;    // 商品描述
}) => {
  return request({
    url: '/api/payment/create',
    method: 'POST',
    data: {
      ...data,
      appId: pingppConfig.appId
    }
  });
};

// 查询支付状态
export const queryPaymentStatus = (orderId: string) => {
  return request({
    url: '/api/payment/status',
    method: 'GET',
    params: { orderId }
  });
};

// 获取支付渠道列表
export const getPaymentChannels = () => {
  return request({
    url: '/api/payment/channels',
    method: 'GET'
  });
};