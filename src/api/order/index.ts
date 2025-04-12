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

// 用户选图
export const selectUserPhotos = (orderId: any, ids: number[]) => {
  return request.post('/member/user/deliver-pic/select', {
    orderId,
    ids
  })
}

// 获取精修图
export const getTruingPhotos = (orderId: any) => {
  return request.get(`/member/user/deliver-pic/getTruingPhotos?orderId=${orderId}`)
}

// 完成订单
export const finishOrder = (orderId: any) => {
  return request.get(`/member/order/order/finish/${orderId}`)
}

// 创建评价
export const createEvaluation = (data: {
  userId: string | number,
  nickname: string,
  content: string,
  orderId: string | number,
  rate: number
}) => {
  return request.post('/member/photographer-evaluate/create', data)
}

// 提交退款申请
export const submitRefund = (data: {
  id: any,
  reason: string,
  reasonInfo?: string
}) => {
  return request.post('/member/order/refund', data)
}

// 取消订单
export const cancelOrder = (data: {
  id: any,
  cancellationReason: string
}) => {
  return request.post('/member/order/cancel', data)
}

// 获取隐私号
export const getTmpPhone = (orderId: any) => {
  return request.get(`/member/order/getTmpPhone?id=${orderId}`)
}

// 获取用户发票记录
export const getUserInvoiceList = (data: {
  pageNo: number
  pageSize: number
}) => {
  return request.post('/member/invoice/user/invoice/list', data)
}

// 获取发票下的订单信息
export const getInvoiceOrders = (data: {
  pageNo: number
  pageSize: number
  invoiceId: string | number
}) => {
  return request.post('/member/invoice/invoice/order', data)
}

// 获取用户可开票订单
export const getUserCanInvoiceOrders = (data: {
  pageNo: number
  pageSize: number
  status?: number[]
}) => {
  return request.post('/member/invoice/getUserCanInvoiceOrders', data)
}

// 创建发票
export const createInvoice = (data: {
  orders: {
    orderId: number
    itemAmount: number
  }[]
  invoiceType: number
  invoiceTitle: string
  taxNumber: string
  invoiceAmount: number
  email?: string
  address?: string
  mobile?: string
  bankName?: string
  bankAccountNo?: string
  remark?: string
}) => {
  return request.post('/member/invoice/create', data)
}