import request from '@/utils/request'

export const getCarousel = () => {
  return request.get('/product/carousel/list')
}

// 获得商品spu分页
export const getProductSpuPage = async (data: any) => {
  return await request.post('/product/spu/page', data)
}

// 获得商品大类
export const getCategory = () => {
  return request.get(`/product/category/list`)
}

// 获得商品树形列表
export const getCategoryTree = () => {
  return request.get(`/product/category/listTree`)
}

// 获得商品分类列表（通过categoryId)
export const getSpuDetail = (categoryId: any) => {
  return request.get(`/product/spu/get-detail?categoryId=${categoryId}`)
}

export const getDetail = () => {
  return request.get('/product/category/list')
}

export const getPhotographerUser = (data: any) => {
  return request.post('/member/photographer/listPhotographerUser', data)
}

// 获得摄影师详情
export const getPhotographerUserDetail = (userId: any) => {
  return request.get('/member/photographer/getPhotographerDetail?userId=' + userId)
}

// 获取摄影师评价列表
export const getPhotographerEvaluatePage = (pageNo: number, pageSize: number, userId: any) => {
  return request.get(`/member/photographer-evaluate/page?pageNo=${pageNo}&pageSize=${pageSize}&userId=${userId}`)
}