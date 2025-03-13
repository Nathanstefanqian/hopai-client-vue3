import request from '@/utils/request'

export interface OrderVO {
  pageNo: number
  pageSize: number
  status?: number[]
}

export const getUserOrder = (data: OrderVO) => {
  return request.post('/member/order/getUserOrders', data)
}