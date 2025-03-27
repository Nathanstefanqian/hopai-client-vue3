import request from '@/utils/request'

export interface OrderVO {
  pageNo: number
  pageSize: number
  status?: number[]
}

// 获得订单用户
export const getUserOrder = (data: OrderVO) => {
  return request.post('/member/order/getUserOrders', data)
}

// 创建订单
export const createUserOrders = (data: any) => {
  return request.post('/member/order/create', data)
}

// 提交支付订单
export const submitPayOrders = (data: any) => {
  return request.post('/member/order/submit', data)
}

// 获取订单二维码
export const getQrCode = (id: number) => {
  return request.get(`/member/order/getQrCode?id=${id}`)
}