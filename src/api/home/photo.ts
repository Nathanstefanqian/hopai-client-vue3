import request from '@/utils/request'

// 获取图片URL
export const getPhotoUrl = (id: number) => {
  return request.get(`/member/photo/get?id=${id}`)
}

// 获取相册照片列表
export const getPhotoPage = (pageNo: any, pageSize: number, albumId: any) => {
  return request.get(`/member/photo/page?pageNo=${pageNo}&pageSize=${pageSize}&albumId=${albumId}`)
}


// 获取订单原图
export const getOrderOriginPhotos = (orderId: any) => {
  return request.get(`/member/user/deliver-pic/getOriginPhotos?orderId=${orderId}`)
}
