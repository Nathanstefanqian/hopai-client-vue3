// Ping++ 支付配置
export const pingppConfig = {
  // 应用ID，在 Ping++ 管理平台获取
  appId: 'app_vvDiHGqfrjTG1eHy',
  // API密钥，在 Ping++ 管理平台获取
  apiKey: 'your_api_key',
  // 私钥路径，用于请求签名，在 Ping++ 管理平台获取
  privateKeyPath: 'path_to_your_private_key',
  // 支付渠道配置
  channels: {
    alipay: {
      // 支付宝配置参数
      enabled: true,
      // 其他支付宝特定配置
    },
    wx: {
      // 微信支付配置参数
      enabled: true,
      // 其他微信支付特定配置
    }
  },
  // Webhooks配置
  webhooks: {
    // 支付成功通知地址
    paymentSuccess: '/api/payment/webhook/success',
    // 支付失败通知地址
    paymentFailed: '/api/payment/webhook/failed'
  }
};