import request from '@/utils/request'

// 获取图片URL
export const getPhotoUrl = (id: number) => {
  return request.get(`/member/photo/get?id=${id}`)
}

// 获取相册照片列表
export const getPhotoPage = (pageNo: number, pageSize: number, albumId: number) => {
  return request.get(`/member/photo/page?pageNo=${pageNo}&pageSize=${pageSize}&albumId=${albumId}`)
}