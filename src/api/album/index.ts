import request from '@/utils/request'



export const getAlbumPage = async (params: any) => {
  return await request.get('/member/photo-album/page', params)
}