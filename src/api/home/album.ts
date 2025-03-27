import request from '@/utils/request'

// 获取摄影师相册分页
export const getPhotographerAlbumPage = (data: any) => {
  return request.post('/member/album/page', data)
}

// 获得摄影师相册详情
export const getPhotographerAlbumDetail = (id: any) => {
  return request.get('/member/album/get?id=' + id)
}