import request from '@/utils/request'

export interface PhotoVO {
  pageNo: number
  pageSize: number
  id: string
  status?: number[]
}

export const getAlbumPage = async (params: any) => {
  if(params.categoryId) {
    return await request.get(`/member/photo-album/page?categoryId=${params.categoryId}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`)
  } else {
    return await request.get(`/member/photo-album/page?pageNo=${params.pageNo}&pageSize=${params.pageSize}`)
  }
}

export const getAlbumPhoto = async (data: PhotoVO) => {
  return await request.get(`/member/photo-album/photos/page?id=${data.id}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`)
}